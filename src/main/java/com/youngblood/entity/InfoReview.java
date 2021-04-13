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
    private String contents;
//    private User user;
    private String user;// userId
    private String username;
    private Long createDate;
    private Long updateDate;
    @Nullable
    private Integer thumbs;
    private String infoId;
}
