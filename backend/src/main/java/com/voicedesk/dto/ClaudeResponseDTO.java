package com.voicedesk.dto;

public class ClaudeResponseDTO {

    private String title;
    private String formattedContent;

    public ClaudeResponseDTO() {}

    public ClaudeResponseDTO(String title, String formattedContent) {
        this.title = title;
        this.formattedContent = formattedContent;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getFormattedContent() { return formattedContent; }
    public void setFormattedContent(String formattedContent) { this.formattedContent = formattedContent; }
}
