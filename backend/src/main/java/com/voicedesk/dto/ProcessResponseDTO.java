package com.voicedesk.dto;

public class ProcessResponseDTO {

    private String transcript;
    private String title;
    private String formattedContent;
    private String pdfDownloadUrl;

    public ProcessResponseDTO() {}

    public ProcessResponseDTO(String transcript, String title, String formattedContent, String pdfDownloadUrl) {
        this.transcript = transcript;
        this.title = title;
        this.formattedContent = formattedContent;
        this.pdfDownloadUrl = pdfDownloadUrl;
    }

    public String getTranscript() { return transcript; }
    public void setTranscript(String transcript) { this.transcript = transcript; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getFormattedContent() { return formattedContent; }
    public void setFormattedContent(String formattedContent) { this.formattedContent = formattedContent; }

    public String getPdfDownloadUrl() { return pdfDownloadUrl; }
    public void setPdfDownloadUrl(String pdfDownloadUrl) { this.pdfDownloadUrl = pdfDownloadUrl; }
}
