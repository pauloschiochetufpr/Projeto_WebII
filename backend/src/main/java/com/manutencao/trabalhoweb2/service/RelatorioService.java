// package com.manutencao.trabalhoweb2.service;

// import com.manutencao.trabalhoweb2.dto.ReceitaPorCategoriaDTO;
// import com.manutencao.trabalhoweb2.dto.ServicoPagoDTO;
// import com.manutencao.trabalhoweb2.model.Solicitacao;
// import com.manutencao.trabalhoweb2.repository.SolicitacaoRepository;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;

// import java.time.LocalDate;
// import java.time.LocalDateTime;
// import java.time.LocalTime;
// import java.util.List;
// import java.util.stream.Collectors;

// @Service
// public class RelatorioService {

//     @Autowired
//     private SolicitacaoRepository solicitacaoRepository;

//     /**
//      * RF019
//      */
//     public List<ServicoPagoDTO> findServicosPagos(LocalDate startDate, LocalDate endDate) {

//         LocalDateTime startDateTime = startDate != null ? startDate.atStartOfDay() : null;
//         LocalDateTime endDateTime = endDate != null ? endDate.atTime(LocalTime.MAX) : null;

//         List<Solicitacao> solicitacoes = solicitacaoRepository.findServicosPagosByPeriod(startDateTime, endDateTime);

//         return solicitacoes.stream()
//             .map(this::mapToServicoPagoDTO)
//             .collect(Collectors.toList());
//     }

//     /**
//      * RF020
//      */
//     public List<ReceitaPorCategoriaDTO> getRevenueByCategory() {
//         return solicitacaoRepository.aggregateRevenueByCategory();
//     }

//     private ServicoPagoDTO mapToServicoPagoDTO(Solicitacao s) {
//     return new ServicoPagoDTO(
//         s.getIdSolicitacao(), 
//         s.getCliente().getNome(),              
//         s.getDescricao(),
//         s.getValor()
//         );
//     }
// }