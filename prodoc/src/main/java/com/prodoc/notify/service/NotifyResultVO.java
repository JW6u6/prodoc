package com.prodoc.notify.service;

import java.sql.Date;

import lombok.Data;

@Data
public class NotifyResultVO {
   private String noteId;
   private String noteType;
   
   private String reUserId;
   
   private String creUserId;
   private String creUserName;
   private String profile;
   private String platform;
   
   private String workId;
   private String workName;
   
   private String pageId;
   private String pageName;

   private String displayId;
   private String replyId;
   private String content;
   
   private Date creDate;
   private String alarmType;
}
