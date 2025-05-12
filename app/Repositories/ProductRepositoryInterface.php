<?php

namespace App\Repositories;

interface ProductRepositoryInterface
{
    public function getLatest($limit);
    public function create(array $data);
    public function update($id, array $data);
    // public function delete($id);
}
