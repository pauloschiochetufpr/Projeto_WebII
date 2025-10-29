package com.manutencao.trabalhoweb2.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.*;
import com.manutencao.trabalhoweb2.dto.ReceitaDiariaDTO;
import com.manutencao.trabalhoweb2.repository.HistSolicitacaoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.awt.Color;
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

    public byte[] gerarRelatorioPDF(LocalDate dataInicial, LocalDate dataFinal) {
        List<ReceitaDiariaDTO> receitas = histRepository.buscarReceitasAgrupadasPorDia(dataInicial, dataFinal);

        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        try {
            Document document = new Document(PageSize.A4, 40, 40, 40, 40);
            PdfWriter.getInstance(document, baos);
            document.open();

            // Título
            Paragraph titulo = new Paragraph("RELATÓRIO DE RECEITAS POR PERÍODO", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16));
            titulo.setAlignment(Element.ALIGN_CENTER);
            document.add(titulo);

            Paragraph subtitulo = new Paragraph("Sistema de Controle de Manutenção", FontFactory.getFont(FontFactory.HELVETICA, 12));
            subtitulo.setAlignment(Element.ALIGN_CENTER);
            subtitulo.setSpacingAfter(10);
            document.add(subtitulo);

            String periodo = formatarPeriodo(dataInicial, dataFinal);
            Paragraph infoPeriodo = new Paragraph(periodo, FontFactory.getFont(FontFactory.HELVETICA, 11));
            infoPeriodo.setAlignment(Element.ALIGN_CENTER);
            infoPeriodo.setSpacingAfter(20);
            document.add(infoPeriodo);

            // Tabela
            PdfPTable table = new PdfPTable(3);
            table.setWidthPercentage(100);
            table.setWidths(new float[]{40, 30, 30});

            adicionarCabecalho(table);

            BigDecimal totalGeral = BigDecimal.ZERO;
            long totalSolicitacoes = 0;

            for (ReceitaDiariaDTO receita : receitas) {
                table.addCell(celula(receita.getData().format(formatter), Element.ALIGN_LEFT));
                table.addCell(celula(receita.getQuantidadeSolicitacoes().toString(), Element.ALIGN_CENTER));
                table.addCell(celula(formatarValor(receita.getValorTotal()), Element.ALIGN_RIGHT));

                totalGeral = totalGeral.add(receita.getValorTotal());
                totalSolicitacoes += receita.getQuantidadeSolicitacoes();
            }

            adicionarTotais(table, totalGeral, totalSolicitacoes);
            document.add(table);

            adicionarResumo(document, receitas.size(), totalSolicitacoes, totalGeral);

            Paragraph rodape = new Paragraph(
                    "Relatório gerado em: " + LocalDate.now().format(formatter) +
                            " às " + java.time.LocalTime.now().format(DateTimeFormatter.ofPattern("HH:mm")),
                    FontFactory.getFont(FontFactory.HELVETICA, 9, Color.GRAY)
            );
            rodape.setAlignment(Element.ALIGN_RIGHT);
            rodape.setSpacingBefore(20);
            document.add(rodape);

            document.close();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar PDF: " + e.getMessage(), e);
        }

        return baos.toByteArray();
    }

    private void adicionarCabecalho(PdfPTable table) {
        table.addCell(header("Data"));
        table.addCell(header("Qtd. Solicitações"));
        table.addCell(header("Receita Total"));
    }

    private PdfPCell header(String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11)));
        cell.setHorizontalAlignment(Element.ALIGN_CENTER);
        cell.setBackgroundColor(Color.LIGHT_GRAY);
        return cell;
    }

    private PdfPCell celula(String text, int align) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA, 10)));
        cell.setHorizontalAlignment(align);
        return cell;
    }

    private void adicionarTotais(PdfPTable table, BigDecimal totalGeral, long totalSolicitacoes) {
        table.addCell(celulaNegrito("TOTAL", Element.ALIGN_RIGHT, Color.YELLOW));
        table.addCell(celulaNegrito(String.valueOf(totalSolicitacoes), Element.ALIGN_CENTER, Color.YELLOW));
        table.addCell(celulaNegrito(formatarValor(totalGeral), Element.ALIGN_RIGHT, Color.YELLOW));
    }

    private PdfPCell celulaNegrito(String text, int align, Color bg) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FontFactory.getFont(FontFactory.HELVETICA_BOLD, 10)));
        cell.setHorizontalAlignment(align);
        cell.setBackgroundColor(bg);
        return cell;
    }

    private void adicionarResumo(Document document, int totalDias, long totalSolicitacoes, BigDecimal totalGeral) throws DocumentException {
        document.add(new Paragraph("\nRESUMO", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14)));
        document.add(new Paragraph(" "));

        BigDecimal ticketMedio = totalSolicitacoes > 0
                ? totalGeral.divide(BigDecimal.valueOf(totalSolicitacoes), 2, java.math.RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        PdfPTable resumoTable = new PdfPTable(2);
        resumoTable.setWidthPercentage(60);
        resumoTable.setSpacingBefore(10);

        adicionarLinhaResumo(resumoTable, "Total de Dias:", String.valueOf(totalDias));
        adicionarLinhaResumo(resumoTable, "Total de Solicitações:", String.valueOf(totalSolicitacoes));
        adicionarLinhaResumo(resumoTable, "Receita Total:", formatarValor(totalGeral));
        adicionarLinhaResumo(resumoTable, "Ticket Médio:", formatarValor(ticketMedio));

        document.add(resumoTable);
    }

    private void adicionarLinhaResumo(PdfPTable table, String label, String value) {
        table.addCell(celula(label, Element.ALIGN_LEFT));
        table.addCell(celula(value, Element.ALIGN_RIGHT));
    }

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

    private String formatarValor(BigDecimal valor) {
        return String.format("R$ %,.2f", valor);
    }
}
