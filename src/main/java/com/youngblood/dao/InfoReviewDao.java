package com.youngblood.dao;



import com.youngblood.entity.InfoReview;

import java.util.List;

public interface InfoReviewDao {
    InfoReview findById(String id);
    List<InfoReview> findByInfoIdPageable(String infoId, Integer page, Integer limit);
    List<InfoReview> findByInfoId(String infoId);
    String saveInfoReview(InfoReview infoReview);
    int getReviewsNumByInfoId(String infoId);
    Boolean deleteById(String reviewId);
    Boolean deleteByInfoId(String infoId);

}
