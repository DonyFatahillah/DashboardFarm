<?php
class PublicController {
    public static function getStats($pdo) {
        $produksi = $pdo->query("SELECT SUM(jumlah_telur) as total FROM produksi_harian WHERE DATE(tanggal) = CURDATE()")->fetch()['total'] ?? 0;
        $pakan = $pdo->query("SELECT SUM(jumlah_kg) as total FROM pakan_harian WHERE DATE(tanggal) = CURDATE()")->fetch()['total'] ?? 0;
        $pendapatan = $pdo->query("SELECT SUM(total_harga) as total FROM penjualan_telur WHERE MONTH(tanggal) = MONTH(CURDATE()) AND YEAR(tanggal) = YEAR(CURDATE())")->fetch()['total'] ?? 0;
        $telurRusak = $pdo->query("SELECT SUM(jumlah) as total FROM telur_rusak")->fetch()['total'] ?? 0;
        $pupuk = $pdo->query("SELECT SUM(jumlah_karung) as total FROM penjualan_pupuk")->fetch()['total'] ?? 0;

        $chartData = $pdo->query("SELECT DATE(tanggal) as date, SUM(jumlah_telur) as total_telur FROM produksi_harian GROUP BY DATE(tanggal) ORDER BY DATE(tanggal) DESC LIMIT 7")->fetchAll();
        
        $data = [
            'totalPupukTerjual' => (int)$pupuk,
            'totalTelurRusak' => (int)$telurRusak,
            'produksiHariIni' => (int)$produksi,
            'totalPakanHariIni' => (float)$pakan,
            'pendapatanBulanIni' => (float)$pendapatan,
            'chartData' => array_reverse($chartData)
        ];

        sendResponse($data, 'Public stats retrieved');
    }
}
