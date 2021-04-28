package com.youngblood.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.youngblood.dao.InfoDao;
import com.youngblood.dao.InfoHeatDao;
import com.youngblood.dao.InfoReviewDao;
import com.youngblood.dao.UserDao;
import com.youngblood.entity.HeatInfoProperties;
import com.youngblood.entity.Info;
import com.youngblood.entity.InfoReview;
import com.youngblood.entity.User;
import com.youngblood.enums.EnumYoungBloodException;
import com.youngblood.exceptions.YoungBloodException;
import com.youngblood.service.InfoReviewService;
import com.youngblood.service.InfoService;
import com.youngblood.utils.RedisUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.redis.connection.RedisZSetCommands;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
public class InfoServiceImpl implements InfoService {
    @Autowired
    private InfoDao infoDao;
    @Autowired
    private RedisUtil redisUtil;
    @Autowired
    private HeatInfoProperties heatInfoProperties;
    @Autowired
    private InfoReviewDao infoReviewDao;
    @Autowired
    private PictureServiceImpl pictureService;
    @Autowired
    private UserDao userDao;
    @Autowired
    private MongoTemplate mongoTemplate;
    @Override
    public List<Info> getHeatInfos(String userId, boolean isRefresh) {
        List<Info> infos = new ArrayList<>();
        // 差集运算 -- zset无直接差集操作 需先求并集 再将weight设为1,0 将重合的元素的score设置为0 去除score为0的key
        try {
            if(isRefresh){
                redisUtil.delete(userId);
            }
            List<String> allHeatInfo = new ArrayList<>();
            allHeatInfo.add("micro_allHeatInfo");
            redisUtil.zUnionAndStore(userId,allHeatInfo, "micro_temp_"+userId,
                    RedisZSetCommands.Aggregate.MIN, RedisZSetCommands.Weights.of(0,1));
            redisUtil.zRemoveRangeByScore("micro_temp_"+userId,0,0);
            // 前三条展示
            Set<ZSetOperations.TypedTuple<String>> temp = redisUtil.zReverseRangeWithScores("micro_temp_"+userId, 0, heatInfoProperties.getReturn_nums());
            if(temp!=null && temp.size()!=0){
                redisUtil.zAdd(userId,temp);
                redisUtil.expire(userId,heatInfoProperties.getUserId_outtime(), TimeUnit.MINUTES);
            }
            String[] ids = new String[temp.size()+1];
            int index = 0;
            for(ZSetOperations.TypedTuple<String> val:temp){
                ids[index++] = val.getValue();
            }
            infos = infoDao.findByIdsDateOrder(ids);
            redisUtil.delete("micro_temp_"+userId);
        }catch (Exception e){
            e.printStackTrace();
            System.out.println("Error when getting the heat infos");
        }
        // update the number of like and view
        for(Info info:infos){
            Set<String> users = redisUtil.setMembers("micro:like:" + info.getId());
            int nums = users.size();
            redisUtil.incrBy("micro:view:"+info.getId(),1);
            List<InfoReview> comments = infoReviewDao.findByInfoId(info.getId());
            info.setViews(Integer.parseInt(redisUtil.get("micro:view:"+info.getId())));
            info.setThumbs(nums);
            info.setLike(users);
            info.setComments(comments);
            info.setShares(redisUtil.sSize("micro:share:"+info.getUser()+":"+info.getId()));
        }
        return infos;
    }

    @Override
    public Info findInfoById(String id) {
        Info info = infoDao.findById(id);
        if(info==null){
            throw new YoungBloodException(EnumYoungBloodException.MSG_SHARE_NOT_FOUND);
        }
        Set<String> users = redisUtil.setMembers("micro:like:" + info.getId());
        int nums = users.size();
        redisUtil.incrBy("micro:view:"+info.getId(),1);
        List<InfoReview> comments = infoReviewDao.findByInfoId(info.getId());
        info.setViews(Integer.parseInt(redisUtil.get("micro:view:"+info.getId())));
        info.setThumbs(nums);
        info.setLike(users);
        info.setComments(comments);
        info.setShares(redisUtil.sSize("micro:share:"+info.getUser()+":"+info.getId()));
        return info;
    }

    @Override
    public String saveInfo(Info info, String userId, MultipartFile[] multipartFile) {
        if(info.isHasImage()){
            List<String> urls = pictureService.saveObjectsStream(multipartFile);
            info.setImages(urls);
        }
        info.setIsShare(false);
        info.setOri_info(null);
        String infoId = infoDao.saveInfo(info, userId);
        //后续更新异常处理
        if(infoId==null){
            throw new YoungBloodException(EnumYoungBloodException.MSG_ADDED_ERROR);
        }
        return infoId;
    }

    @Override
    public String shareInfo(String contents, String userId, String ori_id) {
        Info ori_info = this.findInfoById(ori_id);
        if(ori_info==null){
            throw new YoungBloodException(EnumYoungBloodException.MSG_SHARE_NOT_FOUND);
        }
        User user = userDao.findByUserId(userId);
        Info info = new Info();
        info.setOri_info(ori_info);
        info.setIsShare(true);
        info.setHasImage(false);
        Long startDate = new Date().getTime()/1000;
        info.setUser(user.getId());
        info.setUsername(user.getUsername());
        info.setCreateDate(startDate);
        info.setUpdateDate(startDate);
        info.setViews(0);
        info.setReviews(0);
        info.setThumbs(0);
        info.setShares(0L);
        info.setContents(contents);
        redisUtil.sAdd("micro:share:"+ori_info.getUser()+":"+ori_info.getId(),userId);
        Info newInfo = mongoTemplate.save(info, "info");
        return newInfo.getId();
    }


    @Override
    public void likeInfo(String userId, String infoId) {
        //某个动态的点赞人
        Long flagA = redisUtil.sAdd("micro:like:" + infoId, userId);
        //我的点赞
        Long flagB = redisUtil.sAdd("micro:user:like:" + userId, infoId);
        if(flagA==null || flagB==null){
            throw new YoungBloodException(EnumYoungBloodException.MSG_LIKE_ERROR);
        }
//        Info info = infoDao.findById(infoId);
//        User user = userDao.findByUserId(userId);
//        PushMsgStatus pushMsgStatus = new PushMsgStatus();
//        pushMsgStatus.setCreateTime(String.valueOf(new Date().getTime()/1000));
//        pushMsgStatus.setInfoId(infoId);
//        pushMsgStatus.setOperationName("thumb");
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
    }

    @Override
    public void unLikeInfo(String userId, String infoId) {
        Long flagA = redisUtil.sRemove("micro:like:" + infoId, userId);
        Long flagB = redisUtil.sRemove("micro:user:like:" + userId, infoId);
//        Info info = infoDao.findById(infoId);
//        String keyField = infoId + ":" + "thumb:" + userId;
//        redisUtil.hDelete("status:"+info.getUser().getId(), keyField);
        if(flagA==null || flagB==null){
            throw new YoungBloodException(EnumYoungBloodException.MSG_UNLIKE_ERROR);
        }
    }

    @Override
    public boolean likeAleadyInfo(String userId, String infoId) {
        Boolean flag = redisUtil.sIsMember("micro:like:" + infoId, userId);
        if(flag==null){
            throw new YoungBloodException(EnumYoungBloodException.MSG_LIKE_HISTORY_ERROR);
        }
        return flag;
    }

    @Override
    public List<Info> likeHistoryInfo(String userId, Integer page, Integer limit) {
        Set<String> infoIdList = redisUtil.setMembers("micro:user:like:"+userId);
        if(infoIdList==null){
            throw new YoungBloodException(EnumYoungBloodException.MSG_LIKE_HISTORY_ERROR);
        }
        String [] arr = new String[infoIdList.size()];
        infoIdList.toArray(arr);
        List<Info> infoList = infoDao.findByIds(arr);
        for(Info info:infoList){
            Integer nums = Math.toIntExact(redisUtil.sSize("micro:like:" + info.getId()));
            info.setThumbs(nums);
        }
        return infoList;
    }

    @Override
    public void collectInfo(String userId, String infoId) {
        Long flagA = redisUtil.sAdd("micro:collect:" + infoId, userId);
        Long flagB = redisUtil.sAdd("micro:user:collect:" + userId, infoId);
        if(flagA==null || flagB==null){
            throw new YoungBloodException(EnumYoungBloodException.MSG_COLLECT_ERROR);
        }
    }

    @Override
    public void unCollectInfo(String userId, String infoId) {
        Long flagA = redisUtil.sRemove("micro:collect:" + infoId, userId);
        Long flagB = redisUtil.sRemove("micro:user:collect:" + userId, infoId);
        if(flagA==null || flagB==null){
            throw new YoungBloodException(EnumYoungBloodException.MSG_UNCOLLECT_ERROR);
        }
    }

    @Override
    public boolean collectAlreadyInfo(String userId, String infoId) {
        Boolean flag = redisUtil.sIsMember("micro:collect:" + infoId, userId);
        if(flag==null){
            throw new YoungBloodException(EnumYoungBloodException.MSG_COLLECT_HISTORY_ERROR);
        }
        return flag;
    }

    @Override
    public List<Info> collectHistoryInfo(String userId, Integer page, Integer limit) {
        Set<String> infoIdList = redisUtil.setMembers("micro:user:collect:"+userId);
        if(infoIdList==null){
            throw new YoungBloodException(EnumYoungBloodException.MSG_COLLECT_HISTORY_ERROR);
        }
        String [] arr = new String[infoIdList.size()];
        infoIdList.toArray(arr);
        List<Info> infoList = infoDao.findByIds(arr);
        for(Info info:infoList){
            Integer nums = Math.toIntExact(redisUtil.sSize("micro:collect:" + info.getId()));
            info.setThumbs(nums);
        }
        return infoList;
    }

    @Override
    public void deleteInfoById(String infoId) {
        boolean flag = infoDao.deleteById(infoId);
        if(!flag){
            throw new YoungBloodException(EnumYoungBloodException.MSG_DELETED_ERROR);
        }
    }

    @Override
    public void updateInfo(Info info) {
        boolean flag = infoDao.updateInfo(info);
        if(!flag){
            throw new YoungBloodException(EnumYoungBloodException.MSG_UPDATED_ERROR);
        }
    }

    @Override
    public List<Info> findAll() {
        return infoDao.findAll();
    }
}
