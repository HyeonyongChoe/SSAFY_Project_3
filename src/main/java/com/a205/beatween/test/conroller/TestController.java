package com.a205.beatween.test.conroller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class TestController {

    @GetMapping(value = "/test", produces = MediaType.TEXT_HTML_VALUE)
    public String test() {
        return "<h1>beatween auto-deployment complete? merge test</h1>";
    }
}