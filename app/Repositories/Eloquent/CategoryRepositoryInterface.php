<?php

namespace App\Repositories\Eloquent;

use App\Models\Category;

interface CategoryRepositoryInterface
{

        public function getAllRootCategoriesWithChildren();
    
        public function findByIdWithChildren($id);
    
        public function create(array $data);
    
        public function update($id, array $data);
    
        public function delete($id);
    
}