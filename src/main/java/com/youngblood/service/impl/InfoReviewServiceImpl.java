package com.youngblood.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.youngblood.dao.InfoDao;
import com.youngblood.dao.InfoReviewDao;
import com.youngblood.dao.UserDao;
import com.youngblood.entity.Info;
import com.youngblood.entity.InfoReview;
import com.youngblood.entity.User;
import com.youngblood.enums.EnumYoungBloodException;
import com.youngblood.exceptions.YoungBloodException;
import com.youngblood.service.InfoReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Date;
import java.util.List;

@Service
public class InfoReviewServiceImpl implements InfoReviewService {
    @Autowired
    private InfoReviewDao infoReviewDao;
    @Autowired
    private UserDao userDao;
    @Autowired
    private InfoDao infoDao;
    @Override
    public InfoReview findById(String id) {
        return infoReviewDao.findById(id);
    }

    @Override
    public List<InfoReview> findByInfoIdPageable(String infoId, Integer page, Integer limit) {
        List<InfoReview> result = infoReviewDao.findByInfoIdPageable(infoId, page, limit);
        if(result== null || result.size() == 0){
            throw new YoungBloodException(EnumYoungBloodException.REVIEW_CANNOT_BE_FOUND);
        }
        return result;
    }
    @Override
    public List<InfoReview> findByInfoId(String infoId) {
        List<InfoReview> result = infoReviewDao.findByInfoId(infoId);
        if(result== null || result.size() == 0){
            throw new YoungBloodException(EnumYoungBloodException.REVIEW_CANNOT_BE_FOUND);
        }
        return result;
    }

    @Override
    public boolean saveInfoReview(String infoId, String userId, InfoReview infoReview) {
        if(infoId==null || infoReview==null){
            return false;
        }
        User user = userDao.findByUserId(userId);
        infoReview.setInfoId(infoId);
        infoReview.setUser(user.getId());
        infoReview.setUsername(user.getUsername());
        infoDao.updateInfoReviewNum(infoId,1);
//        Info info = infoDao.findById(infoId);
        boolean flag = infoReviewDao.saveInfoReview(infoReview);
        //推送信息 弱一致性
//        PushMsgStatus pushMsgStatus = new PushMsgStatus();
//        pushMsgStatus.setCreateTime(String.valueOf(new Date().getTime()/1000));
//        pushMsgStatus.setInfoId(infoId);
//        pushMsgStatus.setOperationName("review");
//        pushMsgStatus.setOperator(user);
//        pushMsgStatus.setInfoOwnerId(info.getUser().getId());
//        pushMsgService.savePushMsgStatus(pushMsgStatus);
//        String infoOwnerId = info.getUser().getId();
//        Long num = redisUtil.hSize("status:" + infoOwnerId);
//        PushMessageResponse response = new PushMessageResponse(num,"未读的新收到的通知数量");
//        String message = JSONObject.toJSONString(response);
//        try {
//            WebSocketServer.sendInfoToUser(message,infoOwnerId);
//        } catch (IOException e) {
//            e.printStackTrace();
//        }
        return flag;
    }

    @Override
    public void deleteReviewById(String reviewId) {
        Boolean flag = infoReviewDao.deleteById(reviewId);
        if(!flag){
            throw new YoungBloodException(EnumYoungBloodException.REVIEW_DELETED_ERROR);
        }
    }
}
