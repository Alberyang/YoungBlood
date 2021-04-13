package com.youngblood.service;



import com.youngblood.entity.InfoReview;

import java.util.List;

public interface InfoReviewService {
    InfoReview findById(String id);
    List<InfoReview> findByInfoIdPageable(String infoId, Integer page, Integer limit);
    List<InfoReview> findByInfoId(String infoId);
    boolean saveInfoReview(String infoId,String userId, InfoReview infoReview);
    void deleteReviewById(String reviewId);
}
