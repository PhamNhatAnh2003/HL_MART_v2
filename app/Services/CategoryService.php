<?php

namespace App\Services;

use App\Repositories\Eloquent\CategoryRepositoryInterface;

class CategoryService
{
    protected $categoryRepository;

    public function __construct(CategoryRepositoryInterface $categoryRepository)
    {
        $this->categoryRepository = $categoryRepository;
    }

    public function getAllRootCategoriesWithChildren()
    {
        try {
            return $this->categoryRepository->getAllRootCategoriesWithChildren();
        } catch (\Exception $e) {
            \Log::error("Error fetching categories: " . $e->getMessage());
            throw new \Exception("Không thể lấy danh sách danh mục: " . $e->getMessage(), 500);
        }
    }

    public function getCategoryByIdWithChildren($id)
    {
        try {
            $category = $this->categoryRepository->findByIdWithChildren($id);
            if (!$category) {
                throw new \Exception('Danh mục không tồn tại', 404);
            }
            return $category;
        } catch (\Exception $e) {
            \Log::error("Error fetching category by ID: " . $e->getMessage());
            throw $e;
        }
    }

    public function createCategory(array $data)
    {
        try {
            return $this->categoryRepository->create($data);
        } catch (\Exception $e) {
            \Log::error("Error creating category: " . $e->getMessage());
            throw new \Exception("Không thể tạo danh mục: " . $e->getMessage(), 500);
        }
    }

    public function updateCategory($id, array $data)
    {
        try {
            $category = $this->categoryRepository->update($id, $data);
            if (!$category) {
                throw new \Exception('Danh mục không tồn tại', 404);
            }
            return $category;
        } catch (\Exception $e) {
            \Log::error("Error updating category: " . $e->getMessage());
            throw new \Exception("Không thể cập nhật danh mục: " . $e->getMessage(), $e->getCode() ?: 500);
        }
    }

    public function deleteCategory($id)
    {
        try {
            $deleted = $this->categoryRepository->delete($id);
            if (!$deleted) {
                throw new \Exception('Danh mục không tồn tại', 404);
            }
            return true;
        } catch (\Exception $e) {
            \Log::error("Error deleting category: " . $e->getMessage());
            throw new \Exception("Không thể xóa danh mục: " . $e->getMessage(), $e->getCode() ?: 500);
        }
    }
}