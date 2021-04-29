package com.youngblood.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "info_heat")
public class InfoHeat {
    @Id
    private String id;
    private int heat;
    private String infoId;
    private Long infoCreateDate;
    public InfoHeat(String infoId,int heat,Long date){
        this.infoId = infoId;
        this.heat = heat;
        this.infoCreateDate = date;
    }
}
