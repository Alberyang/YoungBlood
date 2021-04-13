package com.youngblood.dao;

import com.youngblood.entity.Info;

import java.util.List;

public interface InfoDao {
    List<Info> findAll();
    Info findById(String id);
    List<Info> findByIds(String... ids);
    List<Info> findByIdsDateOrder(String... ids);
    String saveInfo(Info info,String openId);
    boolean deleteById(String id);
    boolean updateInfo(Info info);
    void updateInfoReviewNum(String infoId,int num);
}
