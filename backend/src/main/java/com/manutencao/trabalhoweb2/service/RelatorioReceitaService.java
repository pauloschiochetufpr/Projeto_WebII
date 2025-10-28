package com.manutencao.trabalhoweb2.service;

import com.manutencao.trabalhoweb2.dto.ReceitaDiariaDTO;
import com.manutencao.trabalhoweb2.repository.HistSolicitacaoRepository;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class RelatorioReceitaService {
    
    @Autowired
    private HistSolicitacaoRepository histRepository;
    
    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    
    /**
     * RF019 - Gera o PDF do relatório de receitas
     * @param dataInicial Data inicial do filtro (pode ser null)
     * @param dataFinal Data final do filtro (pode ser null)
     * @return Array de bytes do PDF gerado
     */
    public byte[] gerarRelatorioPDF(LocalDate dataInicial, LocalDate dataFinal) {
        // 1. Busca os dados no banco
        List<ReceitaDiariaDTO> receitas = histRepository
            .buscarReceitasAgrupadasPorDia(dataInicial, dataFinal);
        
        // 2. Cria o PDF em memória
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        
        try (PdfWriter writer = new PdfWriter(baos);
             PdfDocument pdf = new PdfDocument(writer);
             Document document = new Document(pdf)) {
            
            // 3. Adiciona título
            Paragraph titulo = new Paragraph("RELATÓRIO DE RECEITAS POR PERÍODO")
                .setFontSize(18)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER);
            document.add(titulo);
            
            Paragraph subtitulo = new Paragraph("Sistema de Controle de Manutenção")
                .setFontSize(12)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(10);
            document.add(subtitulo);
            
            // 4. Adiciona período do relatório
            String periodo = formatarPeriodo(dataInicial, dataFinal);
            Paragraph infoPeriodo = new Paragraph(periodo)
                .setFontSize(11)
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(20);
            document.add(infoPeriodo);
            
            // 5. Cria a tabela
            Table table = new Table(UnitValue.createPercentArray(new float[]{40, 30, 30}));
            table.setWidth(UnitValue.createPercentValue(100));
            
            // 6. Adiciona cabeçalho da tabela
            adicionarCabecalho(table);
            
            // 7. Adiciona dados e calcula totais
            BigDecimal totalGeral = BigDecimal.ZERO;
            long totalSolicitacoes = 0;
            
            for (ReceitaDiariaDTO receita : receitas) {
                table.addCell(new Cell().add(new Paragraph(receita.getData().format(formatter))));
                table.addCell(new Cell()
                    .add(new Paragraph(receita.getQuantidadeSolicitacoes().toString()))
                    .setTextAlignment(TextAlignment.CENTER));
                table.addCell(new Cell()
                    .add(new Paragraph(formatarValor(receita.getValorTotal())))
                    .setTextAlignment(TextAlignment.RIGHT));
                
                totalGeral = totalGeral.add(receita.getValorTotal());
                totalSolicitacoes += receita.getQuantidadeSolicitacoes();
            }
            
            // 8. Adiciona linha de totais
            adicionarTotais(table, totalGeral, totalSolicitacoes);
            
            document.add(table);
            
            adicionarResumo(document, receitas.size(), totalSolicitacoes, totalGeral);

            Paragraph rodape = new Paragraph("Relatório gerado em: " + 
                LocalDate.now().format(formatter) + " às " + 
                java.time.LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")))
                .setFontSize(9)
                .setTextAlignment(TextAlignment.RIGHT)
                .setMarginTop(20)
                .setFontColor(ColorConstants.GRAY);
            document.add(rodape);
            
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar PDF: " + e.getMessage(), e);
        }
        
        return baos.toByteArray();
    }
    
    /**
     * Adiciona o cabeçalho da tabela
     */
    private void adicionarCabecalho(Table table) {
        Cell headerData = new Cell()
            .add(new Paragraph("Data").setBold())
            .setBackgroundColor(ColorConstants.LIGHT_GRAY)
            .setTextAlignment(TextAlignment.CENTER);
        
        Cell headerQtd = new Cell()
            .add(new Paragraph("Qtd. Solicitações").setBold())
            .setBackgroundColor(ColorConstants.LIGHT_GRAY)
            .setTextAlignment(TextAlignment.CENTER);
        
        Cell headerValor = new Cell()
            .add(new Paragraph("Receita Total").setBold())
            .setBackgroundColor(ColorConstants.LIGHT_GRAY)
            .setTextAlignment(TextAlignment.CENTER);
        
        table.addHeaderCell(headerData);
        table.addHeaderCell(headerQtd);
        table.addHeaderCell(headerValor);
    }
    
    /**
     * Adiciona a linha de totais
     */
    private void adicionarTotais(Table table, BigDecimal totalGeral, long totalSolicitacoes) {
        table.addCell(new Cell()
            .add(new Paragraph("TOTAL").setBold())
            .setBackgroundColor(ColorConstants.YELLOW)
            .setTextAlignment(TextAlignment.RIGHT));
        
        table.addCell(new Cell()
            .add(new Paragraph(String.valueOf(totalSolicitacoes)).setBold())
            .setBackgroundColor(ColorConstants.YELLOW)
            .setTextAlignment(TextAlignment.CENTER));
        
        table.addCell(new Cell()
            .add(new Paragraph(formatarValor(totalGeral)).setBold())
            .setBackgroundColor(ColorConstants.YELLOW)
            .setTextAlignment(TextAlignment.RIGHT));
    }
    
    /**
     * Adiciona o resumo no final do documento
     */
    private void adicionarResumo(Document document, int totalDias, long totalSolicitacoes, BigDecimal totalGeral) {
        document.add(new Paragraph("\n"));
        
        Paragraph tituloResumo = new Paragraph("RESUMO")
            .setFontSize(14)
            .setBold()
            .setMarginTop(20);
        document.add(tituloResumo);

        BigDecimal ticketMedio = totalSolicitacoes > 0 
            ? totalGeral.divide(BigDecimal.valueOf(totalSolicitacoes), 2, java.math.RoundingMode.HALF_UP)
            : BigDecimal.ZERO;
        
        Table resumoTable = new Table(UnitValue.createPercentArray(new float[]{50, 50}));
        resumoTable.setWidth(UnitValue.createPercentValue(100));
        
        resumoTable.addCell(new Cell().add(new Paragraph("Total de Dias:").setBold()));
        resumoTable.addCell(new Cell().add(new Paragraph(String.valueOf(totalDias))));
        
        resumoTable.addCell(new Cell().add(new Paragraph("Total de Solicitações:").setBold()));
        resumoTable.addCell(new Cell().add(new Paragraph(String.valueOf(totalSolicitacoes))));
        
        resumoTable.addCell(new Cell().add(new Paragraph("Receita Total:").setBold()));
        resumoTable.addCell(new Cell().add(new Paragraph(formatarValor(totalGeral))));
        
        resumoTable.addCell(new Cell().add(new Paragraph("Ticket Médio:").setBold()));
        resumoTable.addCell(new Cell().add(new Paragraph(formatarValor(ticketMedio))));
        
        document.add(resumoTable);
    }
    
    /**
     * Formata o período para exibição
     */
    private String formatarPeriodo(LocalDate dataInicial, LocalDate dataFinal) {
        if (dataInicial == null && dataFinal == null) {
            return "Período: Todos os registros";
        } else if (dataInicial == null) {
            return "Período: Até " + dataFinal.format(formatter);
        } else if (dataFinal == null) {
            return "Período: A partir de " + dataInicial.format(formatter);
        } else {
            return String.format("Período: %s até %s", 
                dataInicial.format(formatter), 
                dataFinal.format(formatter));
        }
    }
    
    /**
     * Formata valor monetário
     */
    private String formatarValor(BigDecimal valor) {
        return String.format("R$ %,.2f", valor);
    }
}