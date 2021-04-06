package com.youngblood.service;

import com.youngblood.entity.Info;

import java.util.List;

public interface InfoService {
    List<Info> getHeatInfos(String openId, boolean isRefresh);
    Info findInfoById(String id);
    String saveInfo(Info info,String openId);
    void likeInfo(String openId, String infoId);
    void unLikeInfo(String openId, String infoId);
    boolean likeAleadyInfo(String openId, String infoId);
    List<Info> likeHistoryInfo(String openId,Integer page,Integer limit);

    void collectInfo(String openId, String infoId);
    void unCollectInfo(String openId, String infoId);
    boolean collectAlreadyInfo(String openId, String infoId);
    List<Info> collectHistoryInfo(String openId,Integer page,Integer limit);
}
