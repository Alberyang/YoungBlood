package com.youngblood.controller;

import com.qcloud.cos.model.PutObjectResult;
import com.youngblood.entity.Info;
import com.youngblood.entity.InfoReview;
import com.youngblood.entity.response.ResponseContent;
import com.youngblood.enums.EnumYoungBloodException;
import com.youngblood.exceptions.YoungBloodException;
import com.youngblood.service.InfoReviewService;
import com.youngblood.service.InfoService;
import com.youngblood.service.impl.PictureServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.io.IOException;
import java.net.URL;
import java.util.List;

@RestController
@RequestMapping("info")
public class InfoWebController {
    @Autowired
    private InfoService infoService;
    @Autowired
    private InfoReviewService infoReviewService;

    //返回动态信息
    @GetMapping("/{userId}")
    public ResponseEntity<ResponseContent> queryUpdatedInfo(@PathVariable("userId") String userId,
                                                            @RequestParam(value = "isRefresh",required = false,defaultValue = "false")
                                                                    boolean isRefresh){
        List<Info> result = infoService.getHeatInfos(userId,isRefresh);
        ResponseContent responseContent = new ResponseContent();
        responseContent.setData(result);
        if(result.size()==0){
            throw new YoungBloodException(EnumYoungBloodException.NEW_INFO_CANNOT_BE_FOUND);
        }
        responseContent.setCode(200);
        responseContent.setMsg("load infos successfully");
        return ResponseEntity.ok(responseContent);
    }
    //返回具体一条动态信息
    @GetMapping("/detail/{infoId}")
    public ResponseEntity<ResponseContent> queryOneInfo(@PathVariable("infoId") String infoId){
        Info info = infoService.findInfoById(infoId);
        if(info==null){
            throw new YoungBloodException(EnumYoungBloodException.NEW_INFO_CANNOT_BE_FOUND);
        }
        return ResponseEntity.status(200).body(new ResponseContent(200,info,"success~"));
    }

    //添加动态信息
    @PostMapping("{userId}")
    //@RequestBody Info info,
    public ResponseEntity<ResponseContent> addInfo(@RequestParam("contents") String contents,
                                                   @RequestParam(value = "files",required = false) MultipartFile[] multipartFile,
                                                   @PathVariable("userId") String userId){
        Info info = new Info();
        info.setContents(contents);
        if(multipartFile==null) info.setHasImage(false);
        else info.setHasImage(true);
        String infoId = infoService.saveInfo(info, userId,multipartFile);
        return ResponseEntity.status(200).body(new ResponseContent(200,infoId,"success~"));
    }
    //删除动态信息
    @DeleteMapping("{infoId}")
    public ResponseEntity<ResponseContent> deleteInfoById(@PathVariable("infoId")String infoId){
        infoService.deleteInfoById(infoId);
        return ResponseEntity.status(200).body(new ResponseContent(200,"","delete successfully"));
    }
    //查看一个动态的评论信息
    @GetMapping("review/{infoId}/{page}/{limit}")
    public ResponseEntity<ResponseContent> queryInfoDetailReview(@PathVariable("infoId") String infoId,
                                                                 @PathVariable("page") Integer page,
                                                                 @PathVariable("limit") Integer limit){
        List<InfoReview> result = infoReviewService.findByInfoIdPageable(infoId, page, limit);
        return ResponseEntity.ok(new ResponseContent(200,result,"load review successfully~"));
    }
    //添加评论信息
    @PostMapping("review/{infoId}/{userId}")
    public ResponseEntity<ResponseContent> addInfo(@PathVariable(value = "infoId") String infoId,
                                                   @PathVariable(value = "userId") String userId,
                                                   @RequestBody InfoReview infoReview){
        String reviewId  = infoReviewService.saveInfoReview(infoId, userId, infoReview);
        return ResponseEntity.status(200).body(new ResponseContent(200,reviewId,"ok~"));
    }
    //删除评论信息
    @DeleteMapping("review/{reviewId}")
    public ResponseEntity<ResponseContent> deleteInfoReview(@PathVariable("reviewId")String reviewId){
        infoReviewService.deleteReviewById(reviewId);
        return ResponseEntity.status(200).body(new ResponseContent(200,"","delete successfully"));
    }
    //点赞
    @PostMapping("like/{userId}/{infoId}")
    public ResponseEntity<ResponseContent> likeInfo(@PathVariable("userId") String userId,
                                                    @PathVariable("infoId") String infoId){
        infoService.likeInfo(userId,infoId);
        return ResponseEntity.status(200).body(new ResponseContent(200,infoId,"like(≧∇≦)ﾉ"));
    }
    //取消点赞
    @PostMapping("dislike/{userId}/{infoId}")
    public ResponseEntity<ResponseContent> unLikeInfo(@PathVariable("userId") String userId,
                                                      @PathVariable("infoId") String infoId){
        infoService.unLikeInfo(userId,infoId);
        return ResponseEntity.status(200).body(new ResponseContent(200,infoId,"bye o(╥﹏╥)o"));
    }
    //查询是否已经点过赞
    @GetMapping("likeornot/{userId}/{infoId}")
    public ResponseEntity<ResponseContent> likeAlreadyInfo(@PathVariable("userId") String userId,
                                                           @PathVariable("infoId") String infoId){
        boolean flag = infoService.likeAleadyInfo(userId,infoId);
        return ResponseEntity.status(200).body(new ResponseContent(200,flag,"load successfully!"));
    }
    //查看我已经点过的赞的动态
    @GetMapping("likelog/{userId}/{page}/{limit}")
    public ResponseEntity<ResponseContent> likeHistoryInfo(@PathVariable("userId") String userId,
                                                           @PathVariable(value = "page") Integer page,
                                                           @PathVariable(value = "limit") Integer limit){
        List<Info> infos = infoService.likeHistoryInfo(userId,page,limit);
        if(infos==null||infos.size()==0){
            return ResponseEntity.status(404).body(new ResponseContent(404,"","There is nothing info you like"));
        }
        return ResponseEntity.status(200).body(new ResponseContent(200,infos,"query successfully!"));
    }

    //收藏
    @PostMapping("collect/{userId}/{infoId}")
    public ResponseEntity<ResponseContent> addCollectInfo(@PathVariable("userId") String userId,
                                                          @PathVariable("infoId") String infoId){
        infoService.collectInfo(userId,infoId);
        return ResponseEntity.status(200).body(new ResponseContent(200,infoId,"collect~"));
    }
    //取消收藏
    @PostMapping("discollect/{userId}/{infoId}")
    public ResponseEntity<ResponseContent> unCollectInfo(@PathVariable("userId") String userId,
                                                         @PathVariable("infoId") String infoId){
        infoService.unCollectInfo(userId,infoId);
        return ResponseEntity.status(200).body(new ResponseContent(200,infoId,"bye o(╥﹏╥)o"));
    }
    //查询是否已经收藏
    @GetMapping("collectornot/{userId}/{infoId}")
    public ResponseEntity<ResponseContent> collectAlreadyInfo(@PathVariable("userId") String userId,
                                                              @PathVariable("infoId") String infoId){
        boolean flag = infoService.collectAlreadyInfo(userId,infoId);
        return ResponseEntity.status(200).body(new ResponseContent(200,flag,"load successfully!"));
    }
    //查看我已经收藏的动态
    @GetMapping("collectlog/{userId}/{page}/{limit}")
    public ResponseEntity<ResponseContent> collectHistoryInfo(@PathVariable("userId") String userId,
                                                              @PathVariable(value = "page") Integer page,
                                                              @PathVariable(value = "limit") Integer limit){
        List<Info> infos = infoService.collectHistoryInfo(userId,page,limit);
        if(infos==null||infos.size()==0){
            return ResponseEntity.status(404).body(new ResponseContent(404,"","There is nothing info you collect"));
        }
        return ResponseEntity.status(200).body(new ResponseContent(200,infos,"load successfully!"));
    }
}
