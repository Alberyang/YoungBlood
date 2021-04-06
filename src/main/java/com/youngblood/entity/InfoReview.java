package com.youngblood.entity;

import com.mongodb.lang.Nullable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "review")
public class InfoReview {
    @Id
    private String id;
    private String content;
    private User user;
    private String infoId;
    private Long createDate;
    @Nullable
    private Integer thumbs;
}
