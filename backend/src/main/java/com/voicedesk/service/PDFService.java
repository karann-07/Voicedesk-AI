package com.voicedesk.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class PDFService {

    private static final Logger logger = LoggerFactory.getLogger(PDFService.class);

    private static final float PAGE_WIDTH = PDRectangle.A4.getWidth();
    private static final float PAGE_HEIGHT = PDRectangle.A4.getHeight();
    private static final float MARGIN = 60f;
    private static final float CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;
    private static final float LINE_HEIGHT_BODY = 16f;
    private static final float LINE_HEIGHT_HEADING = 22f;
    private static final float SECTION_SPACING = 10f;

    public byte[] generatePDF(String title, String formattedContent) throws IOException {
        logger.info("Generating PDF for title: {}", title);

        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            PDType1Font boldFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
            PDType1Font regularFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA);
            PDType1Font italicFont = new PDType1Font(Standard14Fonts.FontName.HELVETICA_OBLIQUE);

            float yPosition = PAGE_HEIGHT - MARGIN;

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {

                // Draw header bar
                contentStream.setNonStrokingColor(0.12f, 0.16f, 0.25f); // dark navy
                contentStream.addRect(0, PAGE_HEIGHT - 8f, PAGE_WIDTH, 8f);
                contentStream.fill();

                // Draw "VoiceDesk AI" watermark at top right
                contentStream.setNonStrokingColor(0.7f, 0.7f, 0.7f);
                contentStream.beginText();
                contentStream.setFont(italicFont, 9f);
                contentStream.newLineAtOffset(PAGE_WIDTH - MARGIN - 70, PAGE_HEIGHT - MARGIN + 20);
                contentStream.showText("VoiceDesk AI");
                contentStream.endText();

                yPosition -= 20f;

                // Title
                contentStream.setNonStrokingColor(0.12f, 0.16f, 0.25f);
                contentStream.beginText();
                contentStream.setFont(boldFont, 20f);
                contentStream.newLineAtOffset(MARGIN, yPosition);

                String safeTitle = sanitize(title);
                List<String> titleLines = wrapText(safeTitle, boldFont, 20f, CONTENT_WIDTH);
                for (int i = 0; i < titleLines.size(); i++) {
                    if (i == 0) contentStream.showText(titleLines.get(i));
                    else {
                        contentStream.newLineAtOffset(0, -LINE_HEIGHT_HEADING);
                        contentStream.showText(titleLines.get(i));
                    }
                    yPosition -= LINE_HEIGHT_HEADING;
                }
                contentStream.endText();

                yPosition -= 8f;

                // Divider line
                contentStream.setStrokingColor(0.4f, 0.6f, 1.0f);
                contentStream.setLineWidth(1.5f);
                contentStream.moveTo(MARGIN, yPosition);
                contentStream.lineTo(PAGE_WIDTH - MARGIN, yPosition);
                contentStream.stroke();

                yPosition -= 18f;

                // Content
                contentStream.setNonStrokingColor(0.15f, 0.15f, 0.15f);

                String[] lines = formattedContent.split("\n");
                for (String line : lines) {
                    if (yPosition < MARGIN + 40f) {
                        // New page
                        contentStream.endText();
                        break;
                    }

                    String trimmed = line.trim();

                    if (trimmed.isEmpty()) {
                        yPosition -= SECTION_SPACING;
                        continue;
                    }

                    // Heading detection (markdown ## or #)
                    if (trimmed.startsWith("## ") || trimmed.startsWith("# ")) {
                        String headingText = trimmed.replaceAll("^#+\\s*", "");
                        contentStream.setNonStrokingColor(0.12f, 0.16f, 0.25f);
                        yPosition -= 8f;
                        renderLine(contentStream, sanitize(headingText), boldFont, 13f, MARGIN, yPosition, CONTENT_WIDTH);
                        yPosition -= LINE_HEIGHT_HEADING;
                        contentStream.setNonStrokingColor(0.15f, 0.15f, 0.15f);
                    }
                    // Bullet points
                    else if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || trimmed.startsWith("• ")) {
                        String bulletText = trimmed.replaceAll("^[-*•]\\s*", "");
                        List<String> wrapped = wrapText("• " + sanitize(bulletText), regularFont, 11f, CONTENT_WIDTH - 15f);
                        for (String wl : wrapped) {
                            renderLine(contentStream, wl, regularFont, 11f, MARGIN + 10f, yPosition, CONTENT_WIDTH - 10f);
                            yPosition -= LINE_HEIGHT_BODY;
                        }
                    }
                    // Bold detection (**text**)
                    else if (trimmed.contains("**")) {
                        String cleaned = trimmed.replaceAll("\\*\\*(.*?)\\*\\*", "$1");
                        List<String> wrapped = wrapText(sanitize(cleaned), boldFont, 11f, CONTENT_WIDTH);
                        for (String wl : wrapped) {
                            renderLine(contentStream, wl, boldFont, 11f, MARGIN, yPosition, CONTENT_WIDTH);
                            yPosition -= LINE_HEIGHT_BODY;
                        }
                    }
                    // Regular text
                    else {
                        List<String> wrapped = wrapText(sanitize(trimmed), regularFont, 11f, CONTENT_WIDTH);
                        for (String wl : wrapped) {
                            renderLine(contentStream, wl, regularFont, 11f, MARGIN, yPosition, CONTENT_WIDTH);
                            yPosition -= LINE_HEIGHT_BODY;
                        }
                    }
                }

                // Footer
                contentStream.setNonStrokingColor(0.6f, 0.6f, 0.6f);
                contentStream.beginText();
                contentStream.setFont(italicFont, 8f);
                contentStream.newLineAtOffset(MARGIN, 30f);
                contentStream.showText("Generated by VoiceDesk AI");
                contentStream.endText();

                // Footer line
                contentStream.setStrokingColor(0.85f, 0.85f, 0.85f);
                contentStream.setLineWidth(0.5f);
                contentStream.moveTo(MARGIN, 45f);
                contentStream.lineTo(PAGE_WIDTH - MARGIN, 45f);
                contentStream.stroke();
            }

            document.save(outputStream);
            logger.info("PDF generated successfully. Size: {} bytes", outputStream.size());
            return outputStream.toByteArray();
        }
    }

    private void renderLine(PDPageContentStream cs, String text, PDType1Font font, float fontSize,
                            float x, float y, float maxWidth) throws IOException {
        cs.beginText();
        cs.setFont(font, fontSize);
        cs.newLineAtOffset(x, y);
        cs.showText(text);
        cs.endText();
    }

    private List<String> wrapText(String text, PDType1Font font, float fontSize, float maxWidth) throws IOException {
        List<String> lines = new ArrayList<>();
        String[] words = text.split(" ");
        StringBuilder currentLine = new StringBuilder();

        for (String word : words) {
            String testLine = currentLine.isEmpty() ? word : currentLine + " " + word;
            float width = font.getStringWidth(testLine) / 1000 * fontSize;
            if (width > maxWidth && !currentLine.isEmpty()) {
                lines.add(currentLine.toString());
                currentLine = new StringBuilder(word);
            } else {
                currentLine = new StringBuilder(testLine);
            }
        }
        if (!currentLine.isEmpty()) {
            lines.add(currentLine.toString());
        }
        return lines;
    }

    private String sanitize(String text) {
        if (text == null) return "";
        // Remove characters that PDFBox can't handle in standard fonts
        return text.replaceAll("[^\\x20-\\x7E]", " ").trim();
    }
}
