package com.youngblood.service;

import com.youngblood.entity.Info;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface InfoService {
    //info
    List<Info> getHeatInfos(String openId, boolean isRefresh);
    Info findInfoById(String id);
    void deleteInfoById(String infoId);
    void updateInfo(Info info);
    String saveInfo(Info info, String openId, MultipartFile[] multipartFile);
    //like
    void likeInfo(String openId, String infoId);
    void unLikeInfo(String openId, String infoId);
    boolean likeAleadyInfo(String openId, String infoId);
    List<Info> likeHistoryInfo(String openId,Integer page,Integer limit);
    //collect
    void collectInfo(String openId, String infoId);
    void unCollectInfo(String openId, String infoId);
    boolean collectAlreadyInfo(String openId, String infoId);
    List<Info> collectHistoryInfo(String openId,Integer page,Integer limit);
    //just using it for test
    List<Info> findAll();
}
