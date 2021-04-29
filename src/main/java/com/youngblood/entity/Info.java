package com.youngblood.entity;

import com.mongodb.lang.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


import java.util.List;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "info")
public class Info {
    @Id
    private String id;
//    private String title; // info - title
    private Info ori_info; //转发的帖子
    private Boolean isShare; //是否是转发帖子 默认为false
    private String contents; // info - content - limit the number of words to 255
    @Nullable
    private Set<String> like;
    @Nullable
    private List<String> images;  // save the images url
    @Nullable
    private List<InfoReview> comments;
    private String username;
    private String user; // userId
    @Nullable
    private int thumbs;
    @Nullable
    private int views;
    @Nullable
    private int reviews;
    private Long shares; //分享数
    private Long createDate; //创建日期
    private Long updateDate; //更新时间
//    private User user;
    @Nullable
    private boolean hasImage;

}