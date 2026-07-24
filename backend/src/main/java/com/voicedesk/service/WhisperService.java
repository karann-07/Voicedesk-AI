package com.voicedesk.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.concurrent.TimeUnit;

@Service
public class WhisperService {

    private static final Logger logger = LoggerFactory.getLogger(WhisperService.class);
    private static final String ASSEMBLYAI_UPLOAD_URL = "https://api.assemblyai.com/v2/upload";
    private static final String ASSEMBLYAI_TRANSCRIPT_URL = "https://api.assemblyai.com/v2/transcript";

    @Value("${assemblyai.api.key}")
    private String assemblyAiApiKey;

    private final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectTimeout(60, TimeUnit.SECONDS)
            .readTimeout(120, TimeUnit.SECONDS)
            .writeTimeout(60, TimeUnit.SECONDS)
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String transcribeAudio(MultipartFile audioFile) throws IOException {
        logger.info("Uploading audio to AssemblyAI. File: {}, Size: {} bytes",
                audioFile.getOriginalFilename(), audioFile.getSize());

        String uploadUrl = uploadFileToAssemblyAI(audioFile);
        logger.info("Audio uploaded. URL: {}", uploadUrl);

        String transcriptId = requestTranscription(uploadUrl);
        logger.info("Transcription requested. ID: {}", transcriptId);

        String transcript = pollForTranscript(transcriptId);
        logger.info("Transcript received. Length: {} characters", transcript.length());

        return transcript;
    }

    private String uploadFileToAssemblyAI(MultipartFile audioFile) throws IOException {
        RequestBody fileBody = RequestBody.create(
                audioFile.getBytes(),
                MediaType.parse("application/octet-stream")
        );

        Request request = new Request.Builder()
                .url(ASSEMBLYAI_UPLOAD_URL)
                .addHeader("authorization", assemblyAiApiKey)
                .post(fileBody)
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            String responseBody = response.body() != null ? response.body().string() : "";
            if (!response.isSuccessful()) {
                throw new IOException("AssemblyAI upload failed with status "
                        + response.code() + ": " + responseBody);
            }
            JsonNode json = objectMapper.readTree(responseBody);
            String url = json.path("upload_url").asText();
            if (url == null || url.isBlank()) {
                throw new IOException("AssemblyAI did not return upload URL. Response: " + responseBody);
            }
            return url;
        }
    }

    private String requestTranscription(String audioUrl) throws IOException {
        String body = "{\"audio_url\": \"" + audioUrl + "\"}";

        Request request = new Request.Builder()
                .url(ASSEMBLYAI_TRANSCRIPT_URL)
                .addHeader("authorization", assemblyAiApiKey)
                .addHeader("content-type", "application/json")
                .post(RequestBody.create(body, MediaType.parse("application/json")))
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            String responseBody = response.body() != null ? response.body().string() : "";
            if (!response.isSuccessful()) {
                throw new IOException("AssemblyAI transcription request failed with status "
                        + response.code() + ": " + responseBody);
            }
            JsonNode json = objectMapper.readTree(responseBody);
            String id = json.path("id").asText();
            if (id == null || id.isBlank()) {
                throw new IOException("AssemblyAI did not return transcript ID. Response: " + responseBody);
            }
            return id;
        }
    }

    private String pollForTranscript(String transcriptId) throws IOException {
        String url = ASSEMBLYAI_TRANSCRIPT_URL + "/" + transcriptId;

        for (int i = 0; i < 60; i++) {
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                throw new IOException("Polling interrupted: " + e.getMessage());
            }

            Request request = new Request.Builder()
                    .url(url)
                    .addHeader("authorization", assemblyAiApiKey)
                    .get()
                    .build();

            try (Response response = httpClient.newCall(request).execute()) {
                String responseBody = response.body() != null ? response.body().string() : "";

                if (!response.isSuccessful()) {
                    throw new IOException("AssemblyAI polling failed with status "
                            + response.code() + ": " + responseBody);
                }

                JsonNode json = objectMapper.readTree(responseBody);
                String status = json.path("status").asText();
                logger.info("Poll #{} — status: {}", i + 1, status);

                if ("completed".equals(status)) {
                    String text = json.path("text").asText();
                    if (text == null || text.isBlank()) {
                        throw new IOException("AssemblyAI returned empty transcript.");
                    }
                    return text.trim();
                } else if ("error".equals(status)) {
                    String error = json.path("error").asText("Unknown transcription error");
                    throw new IOException("AssemblyAI transcription error: " + error);
                }
            }
        }
        throw new IOException("Transcription timed out after 3 minutes.");
    }
}
