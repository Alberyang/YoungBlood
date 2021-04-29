package com.youngblood.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "info_snapshot")
public class InfoSnapshot {
    @Id
    private String id;
    private Info info;
    private Long createDate;
    private String oriInfoId;
    public InfoSnapshot(Info info, Long date, String oriInfoId){
        this.info = info;
        this.createDate = date;
        this.oriInfoId = oriInfoId;
    }
}
