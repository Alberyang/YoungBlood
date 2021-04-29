package com.youngblood.service.impl;


import com.youngblood.dao.InfoHeatDao;
import com.youngblood.dao.InfoSnapshotDao;
import com.youngblood.entity.HeatInfoProperties;
import com.youngblood.entity.Info;
import com.youngblood.entity.InfoHeat;
import com.youngblood.entity.InfoSnapshot;
import com.youngblood.service.InfoService;
import com.youngblood.utils.RedisUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.DefaultTypedTuple;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class InfoHeatRefresh {

    @Autowired
    private HeatInfoProperties heatInfoProperties;
    @Autowired
    private InfoService infoService;
    @Autowired
    private InfoSnapshotDao infoSnapshotDAO;
    @Autowired
    private InfoHeatDao infoHeatDAO;
    @Autowired
    private RedisUtil redisUtil;

    @Scheduled(fixedRate=30000)
    public void refreshSnapshot(){
        List<Info> all = infoService.findAll();
        List<InfoSnapshot> result = new ArrayList<>();
        Date date = new Date();
        for(Info info:all){
            InfoSnapshot target = infoSnapshotDAO.findUpDateById(info.getId());
            int likeNum = Math.toIntExact(redisUtil.sSize("micro:like:" + info.getId()));
            String viewNumTemp = redisUtil.get("micro:view:" + info.getId());
            int viewNum;
            if (viewNumTemp==null) viewNum = 1;
            else viewNum = Integer.parseInt(viewNumTemp);
            if(target!=null && target.getInfo().getReviews() == info.getReviews()
                    &&target.getInfo().getThumbs() == likeNum
                    &&target.getInfo().getViews() == viewNum){
                continue;
            }
            info.setThumbs(likeNum);
            info.setViews(viewNum);
            result.add(new InfoSnapshot(info,date.getTime()/1000,info.getId()));
        }
        if(result.size()!=0){
            boolean flag = infoSnapshotDAO.insertBatch(result);
            if(flag) System.out.println("快照表更新完成");
            else System.out.println("快照表更新异常，请查看日志");
        }
    }

    @Scheduled(fixedRate=30000)
    public void refreshHeat(){
        // 距现在的时间超过3小时即删除
        boolean flag = infoSnapshotDAO.deleteOutDate();
        if(flag)  System.out.println("快照表旧数据删除完成");
        else System.out.println("快照表旧数据删除异常，请查看日志");
    }

    @Scheduled(fixedRate=30000)
    public void deleteOldSnapshot(){
        //清空当前热度表
        boolean dropFlag = infoHeatDAO.dropCollection();
        if(dropFlag) System.out.println("热度表被清空");
        else System.out.println("热度表清空异常");
        //生成当前热度表
        List<Info> all = infoService.findAll();
        List<InfoHeat> result = new ArrayList<>();
        for(Info info:all){
            InfoSnapshot oldInfo = infoSnapshotDAO.findOutDateById(info.getId());
            int heat = 0;
            if(oldInfo!=null){
                int view = heatInfoProperties.getView_weight() * Math.abs(oldInfo.getInfo().getViews()-info.getViews());
                int review = heatInfoProperties.getReview_weight() * Math.abs(oldInfo.getInfo().getReviews()-info.getReviews());
                int thumbs = heatInfoProperties.getThumb_weight() * Math.abs(oldInfo.getInfo().getThumbs()-info.getThumbs());
                heat = view + review + thumbs;
                // 数据值在这2分钟内无变化，可能是不火的数据，也可能是很火很重要的但是暂时没有人点赞的
                if(heat == 0){
                    heat = heatInfoProperties.getUcb_valueA(); //此值根据实际情况随时修改
                }
            }
            // 镜像表里还未生成数据，说明是个纯新数据
            else{
                heat = heatInfoProperties.getUcb_valueB(); //此值根据实际情况随时修改
            }
            result.add(new InfoHeat(info.getId(),heat,info.getCreateDate()));
        }
        if(result.size()!=0){
            boolean flag = infoHeatDAO.insertBatch(result);
            if(flag) System.out.println("热度表更新完成");
            else System.out.println("热度表更新异常，请查看日志");
        }
    }

    @Scheduled(fixedRate=50000)
    //更新redis中的热度表
    public void refreshRedisHeatInfo(){
        redisUtil.delete("micro_allHeatInfo");
        List<InfoHeat> allCurHeatInfo = infoHeatDAO.getAllCurHeatInfo();
        Set<ZSetOperations.TypedTuple<String>> values = new HashSet<>();
        for(InfoHeat infoHeat:allCurHeatInfo){
            values.add(new DefaultTypedTuple<String>(infoHeat.getInfoId(), (double) infoHeat.getHeat()));
        }
        if(values.size()!=0){
            redisUtil.zAdd("micro_allHeatInfo",values);
        }
    }

}
