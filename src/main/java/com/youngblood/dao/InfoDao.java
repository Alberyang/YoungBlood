package com.youngblood.dao;

import com.youngblood.entity.Info;

import java.util.List;

public interface InfoDao {
    Long findAllNums();
    List<Info> findPageable(Integer page,Integer limit);
    Info findById(String id);
    List<Info> findByIds(String... ids);
    List<Info> findByIdsDateOrder(String... ids);
    String saveInfo(Info info,String openId);
    boolean deleteById(String id);
    boolean updateInfo(Info info);
    void updateInfoReviewNum(String infoId,int num);
}
