// EmailService.java
package com.manutencao.trabalhoweb2.service;

import java.util.Map;

public interface EmailService {
    void sendSimpleText(String to, String subject, String text);
    void sendHtmlTemplate(String to, String subject, String templateName, Map<String, Object> variables);
}
