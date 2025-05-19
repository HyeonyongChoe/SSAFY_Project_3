package com.a205.beatween.domain.space.controller;

import com.a205.beatween.common.reponse.ResponseDto;
import com.a205.beatween.domain.space.dto.CategoryDto;
import com.a205.beatween.domain.space.entity.Category;
import com.a205.beatween.domain.space.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/spaces/{spaceId}/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping("/")
    public ResponseEntity<ResponseDto<Object>> createCategory(
            @PathVariable("spaceId") Integer spaceId,
            @RequestHeader("X-USER-ID") Integer userId,
            @RequestParam("name") String name
    ) {
        CategoryDto category = categoryService.createCategory(spaceId,name);
        ResponseDto<Object> result = ResponseDto
                .builder()
                .success(true)
                .data(category)
                .build();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/")
    public ResponseEntity<ResponseDto<Object>> getCategories(
            @PathVariable("spaceId") Integer spaceId,
            @RequestHeader("X-USER-ID") Integer userId
    ) {
        List<CategoryDto> categoryList = categoryService.getCategories(spaceId);
        ResponseDto<Object> result = ResponseDto
                .builder()
                .success(true)
                .data(categoryList)
                .build();
        return ResponseEntity.ok(result);
    }

    @PatchMapping("/{categoryId}")
    public ResponseEntity<ResponseDto<Object>> updateCategory(
            @PathVariable("spaceId") Integer spaceId,
            @PathVariable("categoryId") Integer categoryId,
            @RequestHeader("X-USER-ID") Integer userId,
            @RequestParam("name") String name
    ) {
        CategoryDto categoryDto = categoryService.updateCategory(categoryId, name);
        ResponseDto<Object> result = ResponseDto
                .builder()
                .success(true)
                .data(categoryDto)
                .build();
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<ResponseDto<Object>> deleteCategory(
            @PathVariable("spaceId") Integer spaceId,
            @PathVariable("categoryId") Integer categoryId,
            @RequestHeader("X-USER-ID") Integer userId
    ) {
        categoryService.deleteCategory(categoryId);
        ResponseDto<Object> result = ResponseDto
                .builder()
                .success(true)
                .data("카테고리 삭제 완료")
                .build();
        return ResponseEntity.ok(result);
    }
}
