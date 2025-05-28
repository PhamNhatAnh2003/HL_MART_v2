<?php

namespace App\Http\Controllers\AI;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DemandForecastController extends Controller
{
    public function forecastProductSales(Request $request)
{
    $productId = $request->input('product_id');

    if (!$productId) {
        return response()->json([
            'error' => 'Missing product_id'
        ], 400);
    }

    // Lấy dữ liệu số lượng bán mỗi ngày
    $salesData = DB::table('order_items')
        ->join('orders', 'order_items.order_id', '=', 'orders.id')
        ->select(
            DB::raw('DATE(orders.created_at) as date'),
            DB::raw('SUM(order_items.quantity) as total_sold')
        )
        ->where('order_items.product_id', $productId)
        ->groupBy(DB::raw('DATE(orders.created_at)'))
        ->orderBy('date')
        ->get();

    $salesQuantities = $salesData->pluck('total_sold')->toArray();

    $window = 3;

    // Nếu không đủ dữ liệu để dự báo, vẫn trả về lịch sử (không lỗi)
    if (count($salesQuantities) < $window) {
        return response()->json([
            'product_id' => $productId,
            'forecast_next_day_sales' => null,
            'history' => $salesData,
            'message' => 'Not enough data for forecasting'
        ]);
    }

    // Dự báo bằng thuật toán Simple Moving Average
    $averages = [];
    for ($i = 0; $i <= count($salesQuantities) - $window; $i++) {
        $windowSlice = array_slice($salesQuantities, $i, $window);
        $averages[] = array_sum($windowSlice) / $window;
    }

    $nextDayForecast = end($averages);

    return response()->json([
        'product_id' => $productId,
        'forecast_next_day_sales' => round($nextDayForecast, 2),
        'history' => $salesData
    ]);
}

}
