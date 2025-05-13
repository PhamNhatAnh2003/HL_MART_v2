<?php

return [
    'vnp_TmnCode'     => env('VNPAY_TMN_CODE'),
    'vnp_HashSecret'  => env('VNPAY_HASH_SECRET'),
    'vnp_Url'         => env('VNPAY_URL', 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html'),
    'vnp_ReturnUrl'   => env('VNPAY_RETURN_URL','http://127.0.0.1:8000/order-success'),
];
