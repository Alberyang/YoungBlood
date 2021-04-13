package com.youngblood;

import com.youngblood.service.impl.PictureServiceImpl;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.File;
import java.io.IOException;

@RunWith(SpringRunner.class)
@SpringBootTest
public class test {
    @Autowired
    private PictureServiceImpl pictureService;
    @Test
    public void test1(){

        pictureService.saveObjectFile("C:\\Users\\wangy\\Desktop\\unibackground.jfif","unibackground.jfif");
    }
    @Test
    public void test2() throws IOException {
        pictureService.deleteObject("1.txt");
    }
}
