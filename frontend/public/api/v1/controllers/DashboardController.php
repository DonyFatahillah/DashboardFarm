<?php
class DashboardController {
    public static function summary($pdo) {
        $kandang = $pdo->query("SELECT COUNT(*) as total FROM kandang")->fetch()['total'] ?? 0;
        $produksi = $pdo->query("SELECT SUM(jumlah_telur) as total FROM produksi_harian WHERE DATE(tanggal) = CURDATE()")->fetch()['total'] ?? 0;
        $kematian = $pdo->query("SELECT SUM(jumlah_mati) as total FROM kematian_harian WHERE DATE(tanggal) = CURDATE()")->fetch()['total'] ?? 0;
        $pakan = $pdo->query("SELECT SUM(jumlah_kg) as total FROM pakan_harian WHERE DATE(tanggal) = CURDATE()")->fetch()['total'] ?? 0;
        $pendapatan = $pdo->query("SELECT SUM(total_harga) as total FROM penjualan_telur WHERE MONTH(tanggal) = MONTH(CURDATE()) AND YEAR(tanggal) = YEAR(CURDATE())")->fetch()['total'] ?? 0;

        $awal = $pdo->query("SELECT SUM(jumlah_awal) as total FROM batch_ayam")->fetch()['total'] ?? 0;
        $mati = $pdo->query("SELECT SUM(jumlah_mati) as total FROM kematian_harian")->fetch()['total'] ?? 0;
        $sortir = $pdo->query("SELECT SUM(jumlah_sortir) as total FROM kematian_harian")->fetch()['total'] ?? 0;
        
        $data = [
            'total_kandang' => (int)$kandang,
            'total_ayam_aktif' => (int)($awal - $mati - $sortir),
            'produksi_hari_ini' => (int)$produksi,
            'kematian_hari_ini' => (int)$kematian,
            'total_pakan_hari_ini' => (float)$pakan,
            'total_pendapatan_bulan_ini' => (float)$pendapatan
        ];
        sendResponse($data, 'Dashboard summary retrieved');
    }

    public static function chart($pdo) {
        $data = $pdo->query("SELECT DATE(tanggal) as date, SUM(jumlah_telur) as total_telur FROM produksi_harian GROUP BY DATE(tanggal) ORDER BY DATE(tanggal) DESC LIMIT 7")->fetchAll();
        sendResponse(array_reverse($data), 'Chart data retrieved');
    }
}
