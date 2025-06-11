<?php

namespace App\Http\Controllers\AI;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function getSalesData()
    {
        $sales = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->select(
                DB::raw('DATE(orders.ordered_at) as date'),         // lấy mỗi ngày (YYYY-MM-DD)
                'order_items.product_id',
                DB::raw('SUM(order_items.quantity) as quantity_sold'),
                'products.price',
                'products.discount_price',
                'products.stock',
                'products.sold',
                'categories.name as category_name'
            )
            ->where('orders.status', 'completed')
            ->groupBy(
                'date',
                'order_items.product_id',
                'products.price',
                'products.discount_price',
                'products.stock',
                'products.sold',
                'categories.name'
            )
            ->orderBy('date')
            ->get();
    
        return response()->json($sales);
    
    }

}
