package com.youngblood.service;

import com.youngblood.entity.Info;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface InfoService {
    //info
    List<Info> getHeatInfos(String userId, boolean isRefresh);
    Info findInfoById(String id);
    void deleteInfoById(String infoId);
    void updateInfo(Info info);
    String saveInfo(Info info, String userId, MultipartFile[] multipartFile);
    //转发
    String shareInfo(String contents,String userId, String ori_userId);
    //like
    void likeInfo(String userId, String infoId);
    void unLikeInfo(String userId, String infoId);
    boolean likeAleadyInfo(String userId, String infoId);
    List<Info> likeHistoryInfo(String userId,Integer page,Integer limit);
    //collect
    void collectInfo(String userId, String infoId);
    void unCollectInfo(String userId, String infoId);
    boolean collectAlreadyInfo(String userId, String infoId);
    List<Info> collectHistoryInfo(String userId,Integer page,Integer limit);

    //just using it for test
    List<Info> findAll();
}
