package com.youngblood.dao;



import com.youngblood.entity.InfoReview;

import java.util.List;

public interface InfoReviewDao {
    InfoReview findById(String id);
    List<InfoReview> findByInfoId(String infoId, Integer page, Integer limit);
    boolean saveInfoReview(InfoReview infoReview);
    int getReviewsNumByInfoId(String infoId);
}
