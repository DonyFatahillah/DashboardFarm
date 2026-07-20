<?php
class AiController {
    public static function chat($pdo, $body, $geminiKey) {
        $message = $body['message'] ?? '';
        $history = $body['history'] ?? [];

        if (!$geminiKey || $geminiKey === 'secret') {
            sendError('GEMINI_API_KEY is not configured', 400);
        }

        $summary = $pdo->query("SELECT (SELECT COUNT(*) FROM kandang) as total_kandang, (SELECT SUM(jumlah_telur) FROM produksi_harian WHERE DATE(tanggal) = CURDATE()) as produksi_hari_ini")->fetch();
        
        $context = "You are a Farm Management Assistant. Use this data: Total Kandang: {$summary['total_kandang']}, Produksi Hari Ini: {$summary['produksi_hari_ini']}.";

        $contents = [];
        $contents[] = ['role' => 'user', 'parts' => [['text' => $context]]];
        $contents[] = ['role' => 'model', 'parts' => [['text' => 'Understood.']]];
        
        foreach ($history as $h) {
            $contents[] = ['role' => $h['role'], 'parts' => [['text' => $h['parts'][0]['text']]]];
        }
        $contents[] = ['role' => 'user', 'parts' => [['text' => $message]]];

        $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=' . $geminiKey;
        
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(['contents' => $contents]));
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $json = json_decode($response, true);
        
        if ($httpCode === 200 && isset($json['candidates'][0]['content']['parts'][0]['text'])) {
            $text = $json['candidates'][0]['content']['parts'][0]['text'];
            sendResponse(['response' => $text], 'AI response generated');
        } else {
            sendError('AI Error: ' . ($json['error']['message'] ?? 'Unknown error'), $httpCode);
        }
    }
}
