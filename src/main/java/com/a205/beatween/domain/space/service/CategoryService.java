package com.a205.beatween.domain.space.service;

import com.a205.beatween.domain.space.dto.CategoryDto;
import com.a205.beatween.domain.space.entity.Category;
import com.a205.beatween.domain.space.entity.Space;
import com.a205.beatween.domain.space.repository.CategoryRepository;
import com.a205.beatween.domain.space.repository.SpaceRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {


    private final SpaceRepository spaceRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public CategoryDto createCategory(Integer spaceId, String name) {
        Space space = spaceRepository.getReferenceById(spaceId);
        Category category = Category
                .builder()
                .space(space)
                .name(name)
                .build();
        category = categoryRepository.save(category);
        return CategoryDto
                .builder()
                .categoryId(category.getCategoryId())
                .spaceId(category.getSpace().getSpaceId())
                .name(category.getName())
                .build();
    }

    public List<CategoryDto> getCategories(Integer spaceId) {
        List<Category> categoryList = categoryRepository.findBySpace_SpaceId(spaceId);
        List<CategoryDto> result = new ArrayList<CategoryDto>();
        for (Category category : categoryList) {
            CategoryDto categoryDto = CategoryDto
                    .builder()
                    .categoryId(category.getCategoryId())
                    .spaceId(category.getSpace().getSpaceId())
                    .name(category.getName())
                    .build();
            result.add(categoryDto);
        }
        return result;
    }

    @Transactional
    public CategoryDto updateCategory(Integer categoryId, String name) {
        Category category = categoryRepository.getReferenceById(categoryId);
        category.setName(name);
        category = categoryRepository.save(category);
        return CategoryDto
                .builder()
                .categoryId(category.getCategoryId())
                .spaceId(category.getSpace().getSpaceId())
                .name(category.getName())
                .build();
    }

    public void deleteCategory(Integer categoryId) {
        categoryRepository.deleteById(categoryId);
    }
}
