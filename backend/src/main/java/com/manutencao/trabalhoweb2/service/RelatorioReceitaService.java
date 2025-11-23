package com.manutencao.trabalhoweb2.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.manutencao.trabalhoweb2.dto.ReceitaDiariaDTO;
import com.manutencao.trabalhoweb2.dto.ReceitaPorCategoriaDTO;
import com.manutencao.trabalhoweb2.repository.SolicitacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class RelatorioReceitaService {

    @Autowired
    private SolicitacaoRepository solicitacaoRepository;

    private final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public List<ReceitaDiariaDTO> buscarDadosPeriodo(LocalDate inicio, LocalDate fim) {
        LocalDateTime dInicio = (inicio != null) ? inicio.atStartOfDay() : null;
        LocalDateTime dFim = (fim != null) ? fim.atTime(23, 59, 59) : null;
        
        return solicitacaoRepository.findReceitaPorPeriodo(dInicio, dFim);
    }

    public List<ReceitaPorCategoriaDTO> buscarDadosCategoria() {
        return solicitacaoRepository.findReceitaPorCategoria();
    }


    public byte[] gerarRelatorioPeriodoPDF(LocalDate inicio, LocalDate fim) {
        List<ReceitaDiariaDTO> receitas = buscarDadosPeriodo(inicio, fim);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            Document document = new Document(PageSize.A4, 40, 40, 40, 40);
            PdfWriter.getInstance(document, baos);
            document.open();

            adicionarTitulo(document, "RELATÓRIO DE RECEITAS POR PERÍODO");
            String periodoTexto = formatarPeriodo(inicio, fim);
            Paragraph infoPeriodo = new Paragraph(periodoTexto, FontFactory.getFont(FontFactory.HELVETICA, 11));
            infoPeriodo.setAlignment(Element.ALIGN_CENTER);
            infoPeriodo.setSpacingAfter(20);
            document.add(infoPeriodo);

            // Tabela
            PdfPTable table = new PdfPTable(3);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{40, 30, 30});

            adicionarCabecalhoTabela(table, "Data", "Qtd. Solicitações", "Receita Total");

            BigDecimal totalGeral = BigDecimal.ZERO;
            long totalSolicitacoes = 0;

            for (ReceitaDiariaDTO receita : receitas) {
                table.addCell(celula(receita.getData().format(formatter), Element.ALIGN_LEFT));
                table.addCell(celula(receita.getQuantidadeSolicitacoes().toString(), Element.ALIGN_CENTER));
                table.addCell(celula(formatarValor(receita.getValorTotal()), Element.ALIGN_RIGHT));

                if (receita.getValorTotal() != null) totalGeral = totalGeral.add(receita.getValorTotal());
                totalSolicitacoes += receita.getQuantidadeSolicitacoes();
            }

            adicionarRodapeTabela(table, String.valueOf(totalSolicitacoes), totalGeral);
            document.add(table);

            adicionarResumo(document, receitas.size(), totalSolicitacoes, totalGeral, "Total de Dias");
            adicionarRodapePagina(document);

            document.close();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar PDF Período: " + e.getMessage(), e);
        }
        return baos.toByteArray();
    }


    public byte[] gerarRelatorioCategoriaPDF() {
        // Busca os dados usando o método auxiliar
        List<ReceitaPorCategoriaDTO> receitas = buscarDadosCategoria();

        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            Document document = new Document(PageSize.A4, 40, 40, 40, 40);
            PdfWriter.getInstance(document, baos);
            document.open();

            adicionarTitulo(document, "RELATÓRIO DE RECEITAS POR CATEGORIA");
            
            Paragraph sub = new Paragraph("Acumulado Histórico Total", FontFactory.getFont(FontFactory.HELVETICA, 11));
            sub.setAlignment(Element.ALIGN_CENTER);
            sub.setSpacingAfter(20);
            document.add(sub);

            // Tabela
            PdfPTable table = new PdfPTable(3);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{40, 30, 30});

            adicionarCabecalhoTabela(table, "Categoria", "Qtd. Serviços", "Receita Total");

            BigDecimal totalGeral = BigDecimal.ZERO;
            long totalServicos = 0;

            for (ReceitaPorCategoriaDTO item : receitas) {
                table.addCell(celula(item.getCategoria(), Element.ALIGN_LEFT));
                table.addCell(celula(item.getQuantidade().toString(), Element.ALIGN_CENTER));
                table.addCell(celula(formatarValor(item.getReceitaTotal()), Element.ALIGN_RIGHT));

                if (item.getReceitaTotal() != null) totalGeral = totalGeral.add(item.getReceitaTotal());
                totalServicos += item.getQuantidade();
            }

            adicionarRodapeTabela(table, String.valueOf(totalServicos), totalGeral);
            document.add(table);
            adicionarResumo(document, receitas.size(), totalServicos, totalGeral, "Total de Categorias");
            adicionarRodapePagina(document);

            document.close();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar PDF Categoria: " + e.getMessage(), e);
        }
        return baos.toByteArray();
    }
    
    private void adicionarTitulo(Document doc, String texto) throws DocumentException {
        Paragraph titulo = new Paragraph(texto, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16));
        titulo.setAlignment(Element.ALIGN_CENTER);
        doc.add(titulo);

        Paragraph subtitulo = new Paragraph("Sistema de Controle de Manutenção", FontFactory.getFont(FontFactory.HELVETICA, 12));
        subtitulo.setAlignment(Element.ALIGN_CENTER);
        subtitulo.setSpacingAfter(10);
        doc.add(subtitulo);
    }

    private void adicionarCabecalhoTabela(PdfPTable table, String c1, String c2, String c3) {
        table.addCell(header(c1));
        table.addCell(header(c2));
        table.addCell(header(c3));
    }

    private PdfPCell header(String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11)));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setBackgroundColor(Color.LIGHT_GRAY);
        cell.setPadding(5);
        return cell;
    }

    private PdfPCell celula(String text, int align) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA, 10)));
        cell.setHorizontalAlignment(align);
        cell.setPadding(5);
        return cell;
    }

    private void adicionarRodapeTabela(PdfPTable table, String totalQtd, BigDecimal totalValor) {
        table.addCell(celulaNegrito("TOTAL GERAL", Element.ALIGN_RIGHT, Color.YELLOW));
        table.addCell(celulaNegrito(totalQtd, Element.ALIGN_CENTER, Color.YELLOW));
        table.addCell(celulaNegrito(formatarValor(totalValor), Element.ALIGN_RIGHT, Color.YELLOW));
    }

    private PdfPCell celulaNegrito(String text, int align, Color bg) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10)));
        cell.setHorizontalAlignment(align);
        cell.setBackgroundColor(bg);
        return cell;
    }

    private void adicionarResumo(Document document, int qtdItens, long totalSolicitacoes, BigDecimal totalGeral, String labelQtd) throws DocumentException {
        document.add(new Paragraph("\nRESUMO ESTATÍSTICO", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
        document.add(new Paragraph(" "));

        BigDecimal ticketMedio = totalSolicitacoes > 0
                ? totalGeral.divide(BigDecimal.valueOf(totalSolicitacoes), 2, java.math.RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        PdfPTable resumoTable = new PdfPTable(2);
        resumoTable.setWidthPercentage(60);
        resumoTable.setHorizontalAlignment(Element.ALIGN_LEFT);

        adicionarLinhaResumo(resumoTable, labelQtd + ":", String.valueOf(qtdItens));
        adicionarLinhaResumo(resumoTable, "Total de Solicitações:", String.valueOf(totalSolicitacoes));
        adicionarLinhaResumo(resumoTable, "Receita Bruta:", formatarValor(totalGeral));
        adicionarLinhaResumo(resumoTable, "Ticket Médio (por serviço):", formatarValor(ticketMedio));

        document.add(resumoTable);
    }

    private void adicionarLinhaResumo(PdfPTable table, String label, String value) {
        PdfPCell c1 = celula(label, Element.ALIGN_LEFT);
        c1.setBorder(Rectangle.NO_BORDER);
        table.addCell(c1);
        
        PdfPCell c2 = celula(value, Element.ALIGN_RIGHT);
        c2.setBorder(Rectangle.NO_BORDER);
        table.addCell(c2);
    }

    private void adicionarRodapePagina(Document document) throws DocumentException {
        Paragraph rodape = new Paragraph(
                "Gerado em: " + LocalDate.now().format(formatter) +
                        " às " + java.time.LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")),
                FontFactory.getFont(FontFactory.HELVETICA, 9, Color.GRAY)
        );
        rodape.setAlignment(Element.ALIGN_RIGHT);
        rodape.setSpacingBefore(20);
        document.add(rodape);
    }

    private String formatarPeriodo(LocalDate dataInicial, LocalDate dataFinal) {
        if (dataInicial == null && dataFinal == null) return "Período: Todo o Histórico";
        if (dataInicial == null) return "Período: Até " + dataFinal.format(formatter);
        if (dataFinal == null) return "Período: A partir de " + dataInicial.format(formatter);
        return "Período: " + dataInicial.format(formatter) + " até " + dataFinal.format(formatter);
    }

    private String formatarValor(BigDecimal valor) {
        return (valor == null) ? "R$ 0,00" : String.format("R$ %,.2f", valor);
    }
}