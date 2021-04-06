package com.youngblood.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.youngblood.dao.InfoDao;
import com.youngblood.dao.InfoHeatDao;
import com.youngblood.dao.UserDao;
import com.youngblood.entity.HeatInfoProperties;
import com.youngblood.entity.Info;
import com.youngblood.entity.User;
import com.youngblood.service.InfoService;
import com.youngblood.utils.RedisUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.redis.connection.RedisZSetCommands;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.io.IOException;
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
    private InfoHeatDao infoHeatDao;
    @Autowired
    private RedisUtil redisUtil;
    @Autowired
    private HeatInfoProperties heatInfoProperties;
    @Autowired
    private UserDao userDao;
    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public List<Info> getHeatInfos(String openId, boolean isRefresh) {
        List<Info> infos = new ArrayList<>();
        // 差集运算 -- zset无直接差集操作 需先求并集 再将weight设为1,0 将重合的元素的score设置为0 去除score为0的key
        try {
            if(isRefresh){
                redisUtil.delete(openId);
            }
            List<String> allHeatInfo = new ArrayList<>();
            allHeatInfo.add("allHeatInfo");
            redisUtil.zUnionAndStore(openId,allHeatInfo, "temp_"+openId,
                    RedisZSetCommands.Aggregate.MIN, RedisZSetCommands.Weights.of(0,1));
            redisUtil.zRemoveRangeByScore("temp_"+openId,0,0);
            // 前三条展示
            Set<ZSetOperations.TypedTuple<String>> temp = redisUtil.zReverseRangeWithScores("temp_"+openId, 0, heatInfoProperties.getReturn_nums());
            if(temp!=null && temp.size()!=0){
                redisUtil.zAdd(openId,temp);
                redisUtil.expire(openId,heatInfoProperties.getOpenId_outtime(), TimeUnit.MINUTES);
            }
            String[] ids = new String[temp.size()+1];
            int index = 0;
            for(ZSetOperations.TypedTuple<String> val:temp){
                ids[index++] = val.getValue();
            }
            infos = infoDao.findByIdsDateOrder(ids);
            redisUtil.delete("temp_"+openId);
        }catch (Exception e){
            e.printStackTrace();
            System.out.println("Error when getting the heat infos");
        }
        // update the number of like and view
        for(Info info:infos){
            int nums = Math.toIntExact(redisUtil.sSize("like:" + info.getId()));
            info.setThumbs(nums);
        }
        return infos;
    }

    @Override
    public Info findInfoById(String id) {
        Info newInfo = infoDao.findById(id);
        infoDao.addInfoView(id);
        int nums = Math.toIntExact(redisUtil.sSize("like:" + newInfo.getId()));
        newInfo.setThumbs(nums);
        return newInfo;
    }

    @Override
    public String saveInfo(Info info, String openId) {
        String infoId = infoDao.saveInfo(info, openId);
        //后续更新异常处理
        if(infoId==null){
//            throw new OffercareException(EnumOffercareException.MSG_ADDED_ERROR);
        }
        return infoId;
    }


    @Override
    public void likeInfo(String userId, String infoId) {
        //某个动态的点赞人
        Long flagA = redisUtil.sAdd("like:" + infoId, userId);
        //我的点赞
        Long flagB = redisUtil.sAdd("user:like:" + userId, infoId);
//        if(flagA==null || flagB==null){
//            throw new OffercareException(EnumOffercareException.MSG_LIKE_ERROR);
//        }
        Info info = infoDao.findById(infoId);
        User user = userDao.findByUserId(userId);
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
    public void unLikeInfo(String openId, String infoId) {
        Long flagA = redisUtil.sRemove("like:" + infoId, openId);
        Long flagB = redisUtil.sRemove("user:like:" + openId, infoId);
        Info info = infoDao.findById(infoId);
        String keyField = infoId + ":" + "thumb:" + openId;
        redisUtil.hDelete("status:"+info.getUser().getId(), keyField);
//        if(flagA==null || flagB==null){
//            throw new OffercareException(EnumOffercareException.MSG_UNLIKE_ERROR);
//        }
    }

    @Override
    public boolean likeAleadyInfo(String openId, String infoId) {
        Boolean flag = redisUtil.sIsMember("like:" + infoId, openId);
//        if(flag==null){
//            throw new OffercareException(EnumOffercareException.MSG_LIKE_HISTORY_ERROR);
//        }
        return flag;
    }

    @Override
    public List<Info> likeHistoryInfo(String openId, Integer page, Integer limit) {
        Set<String> infoIdList = redisUtil.setMembers("user:like:"+openId);
//        if(infoIdList==null){
//            throw new OffercareException(EnumOffercareException.MSG_LIKE_HISTORY_ERROR);
//        }
        String [] arr = new String[infoIdList.size()];
        infoIdList.toArray(arr);
        List<Info> infoList = infoDao.findByIds(arr);
        for(Info info:infoList){
            Integer nums = Math.toIntExact(redisUtil.sSize("like:" + info.getId()));
            info.setThumbs(nums);
        }
        return infoList;
    }

    @Override
    public void collectInfo(String openId, String infoId) {
        Long flagA = redisUtil.sAdd("collect:" + infoId, openId);
        Long flagB = redisUtil.sAdd("user:collect:" + openId, infoId);
//        if(flagA==null || flagB==null){
//            throw new OffercareException(EnumOffercareException.MSG_COLLECT_ERROR);
//        }
    }

    @Override
    public void unCollectInfo(String openId, String infoId) {
        Long flagA = redisUtil.sRemove("collect:" + infoId, openId);
        Long flagB = redisUtil.sRemove("user:collect:" + openId, infoId);
//        if(flagA==null || flagB==null){
//            throw new OffercareException(EnumOffercareException.MSG_UNLIKE_ERROR);
//        }
    }

    @Override
    public boolean collectAlreadyInfo(String openId, String infoId) {
        Boolean flag = redisUtil.sIsMember("collect:" + infoId, openId);
//        if(flag==null){
//            throw new OffercareException(EnumOffercareException.MSG_COLLECT_HISTORY_ERROR);
//        }
        return flag;
    }

    @Override
    public List<Info> collectHistoryInfo(String openId, Integer page, Integer limit) {
        Set<String> infoIdList = redisUtil.setMembers("user:collect:"+openId);
//        if(infoIdList==null){
//            throw new OffercareException(EnumOffercareException.MSG_COLLECT_HISTORY_ERROR);
//        }
        String [] arr = new String[infoIdList.size()];
        infoIdList.toArray(arr);
        List<Info> infoList = infoDao.findByIds(arr);
        for(Info info:infoList){
            Integer nums = Math.toIntExact(redisUtil.sSize("collect:" + info.getId()));
            info.setThumbs(nums);
        }
        return infoList;
    }

    @Override
    public List<Info> findAll() {
        return infoDao.findAll();
    }
}
