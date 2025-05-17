<?php
namespace App\Repositories\Eloquent;

use App\Models\Category;

class CategoryRepository implements CategoryRepositoryInterface
{
    protected $category;

    public function __construct(Category $category)
    {
        $this->category = $category;
    }

    public function getAllRootCategoriesWithChildren()
    {
        return $this->category->with('children')->whereNull('parent_id')->get();
    }

    public function findByIdWithChildren($id)
    {
        return $this->category->with(['children', 'parent'])->find($id);
    }

    public function create(array $data)
    {
        return Category::create($data);
    }

    public function update($id, array $data)
    {
        $category = Category::find($id);
        if (!$category) {
            return null;
        }
        $category->update($data);
        return $category;
    }

    public function delete($id)
    {
        $category = Category::find($id);
        if (!$category) {
            return false;
        }
        return $category->delete();
    }
}