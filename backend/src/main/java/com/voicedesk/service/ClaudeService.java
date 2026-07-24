package com.voicedesk.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.voicedesk.dto.ClaudeResponseDTO;
import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
public class ClaudeService {

    private static final Logger logger = LoggerFactory.getLogger(ClaudeService.class);
    private static final String GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
    private static final String GROQ_MODEL = "llama-3.3-70b-versatile";

    @Value("${groq.api.key}")
    private String groqApiKey;

    private final OkHttpClient httpClient = new OkHttpClient.Builder()
            .connectTimeout(60, TimeUnit.SECONDS)
            .readTimeout(120, TimeUnit.SECONDS)
            .writeTimeout(60, TimeUnit.SECONDS)
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    private static final String SYSTEM_PROMPT = """
            You are VoiceDesk AI.

            You will receive a raw speech transcript.

            Your task is to convert the transcript into a clean and professional document.

            Requirements:
            1. Generate a meaningful title.
            2. Correct grammar and punctuation.
            3. Organize information into logical sections.
            4. Create bullet points where appropriate.
            5. Improve readability while preserving meaning.
            6. Do not invent information.
            7. Return valid JSON only.

            Return format:
            {
              "title": "Generated Title",
              "formatted_content": "Formatted markdown content"
            }

            Return only JSON. No preamble, no explanation, no markdown code fences.
            """;

    public ClaudeResponseDTO formatTranscript(String transcript) throws IOException {
        logger.info("Sending transcript to Groq API. Length: {} characters", transcript.length());

        Map<String, Object> requestPayload = Map.of(
                "model", GROQ_MODEL,
                "messages", List.of(
                        Map.of("role", "system", "content", SYSTEM_PROMPT),
                        Map.of("role", "user", "content", transcript)
                ),
                "temperature", 0.3,
                "max_tokens", 2048
        );

        String requestBodyJson = objectMapper.writeValueAsString(requestPayload);

        RequestBody body = RequestBody.create(
                requestBodyJson,
                MediaType.parse("application/json")
        );

        Request request = new Request.Builder()
                .url(GROQ_URL)
                .addHeader("Authorization", "Bearer " + groqApiKey)
                .addHeader("Content-Type", "application/json")
                .post(body)
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            String responseBody = response.body() != null ? response.body().string() : "";

            if (!response.isSuccessful()) {
                logger.error("Groq API error. Status: {}, Body: {}", response.code(), responseBody);
                throw new IOException("Groq API failed with status " + response.code() + ": " + responseBody);
            }

            return parseGroqResponse(responseBody);
        }
    }

    private ClaudeResponseDTO parseGroqResponse(String responseBody) throws IOException {
        JsonNode root = objectMapper.readTree(responseBody);

        String rawText = root
                .path("choices")
                .path(0)
                .path("message")
                .path("content")
                .asText("");

        logger.debug("Raw Groq response: {}", rawText);

        if (rawText.isBlank()) {
            throw new IOException("Groq returned empty response.");
        }

        String cleaned = rawText.trim();
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.replaceAll("(?s)^```[a-zA-Z]*\\n?", "").replaceAll("```$", "").trim();
        }

        try {
            JsonNode parsed = objectMapper.readTree(cleaned);
            String title = parsed.path("title").asText("Untitled Document");
            String formattedContent = parsed.path("formatted_content").asText(cleaned);
            return new ClaudeResponseDTO(title, formattedContent);
        } catch (Exception e) {
            logger.warn("Could not parse Groq JSON response, using raw text. Error: {}", e.getMessage());
            return new ClaudeResponseDTO("Voice Transcript", cleaned);
        }
    }
}
