package com.voicedesk.controller;

import com.voicedesk.dto.ClaudeResponseDTO;
import com.voicedesk.dto.ProcessResponseDTO;
import com.voicedesk.service.ClaudeService;
import com.voicedesk.service.PDFService;
import com.voicedesk.service.WhisperService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/process")
public class ProcessController {

    private static final Logger logger = LoggerFactory.getLogger(ProcessController.class);

    @Autowired
    private WhisperService whisperService;

    @Autowired
    private ClaudeService claudeService;

    @Autowired
    private PDFService pdfService;

    // In-memory store for generated PDFs (keyed by UUID)
    private final Map<String, byte[]> pdfStore = new ConcurrentHashMap<>();

    @PostMapping("/upload")
    public ResponseEntity<?> uploadAudio(@RequestParam("audio") MultipartFile audioFile) {
        return processAudio(audioFile);
    }

    @PostMapping("/record")
    public ResponseEntity<?> recordAudio(@RequestParam("audio") MultipartFile audioFile) {
        return processAudio(audioFile);
    }

    @GetMapping("/download/{pdfId}")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable String pdfId) {
        byte[] pdfBytes = pdfStore.get(pdfId);
        if (pdfBytes == null) {
            return ResponseEntity.notFound().build();
        }
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.attachment()
                .filename("voicedesk-document.pdf")
                .build());
        headers.setContentLength(pdfBytes.length);
        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    private ResponseEntity<?> processAudio(MultipartFile audioFile) {
        if (audioFile == null || audioFile.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "No audio file provided."));
        }

        logger.info("Processing audio file: {}, size: {} bytes",
                audioFile.getOriginalFilename(), audioFile.getSize());

        try {
            // Step 1: Transcribe
            String transcript = whisperService.transcribeAudio(audioFile);

            // Step 2: Format with Claude
            ClaudeResponseDTO claudeResponse = claudeService.formatTranscript(transcript);

            // Step 3: Generate PDF
            byte[] pdfBytes = pdfService.generatePDF(claudeResponse.getTitle(), claudeResponse.getFormattedContent());

            // Step 4: Store PDF and create download URL
            String pdfId = UUID.randomUUID().toString();
            pdfStore.put(pdfId, pdfBytes);

            String pdfDownloadUrl = "/api/process/download/" + pdfId;

            ProcessResponseDTO response = new ProcessResponseDTO(
                    transcript,
                    claudeResponse.getTitle(),
                    claudeResponse.getFormattedContent(),
                    pdfDownloadUrl
            );

            logger.info("Processing complete. Title: {}", claudeResponse.getTitle());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Processing failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Processing failed: " + e.getMessage()));
        }
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "ok", "service", "VoiceDesk AI"));
    }
}
