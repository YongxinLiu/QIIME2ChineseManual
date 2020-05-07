[TOC]

# 前情提要

以下是前面几节的微信推送文章：

- [NBT：QIIME 2可重复、交互式的微生物组分析平台](https://mp.weixin.qq.com/s/-_FHxF1XUBNF4qMV1HLPkg)
- [1简介和安装Introduction&Install](https://mp.weixin.qq.com/s/vlc2uIaWnPSMhPBeQtPR4w)
- [2插件工作流程概述Workflow](https://mp.weixin.qq.com/s/qXlx1a8OQN9Ar7HYIC3OqQ)
- [3老司机上路指南Experienced](https://mp.weixin.qq.com/s/gJZCRzenCplCiOsDRHLhjw)
- [4人体各部位微生物组分析Moving Pictures](https://mp.weixin.qq.com/s/c8ZQegtfNBHZRVjjn5Gyrw)，[Genome Biology：人体各部位微生物组时间序列分析](https://mp.weixin.qq.com/s/DhecHNqv4UjYpVEu48oXAw)
- [5粪菌移植分析练习FMT](https://mp.weixin.qq.com/s/cqzpLOprpClaib1FvH7bjg)，[Microbiome：粪菌移植改善自闭症](https://mp.weixin.qq.com/s/PHpg0y6_mydtCXYUwZa2Yg)
- [6沙漠土壤分析Atacama soil](https://mp.weixin.qq.com/s/tmXAjkl7oW3X4uagLOJu2A)，[mSystems：干旱对土壤微生物组的影响](https://mp.weixin.qq.com/s/3tF6_CfSKBbtLQU4G3NpEQ)
- [7帕金森小鼠教程Parkinson's Mouse](https://mp.weixin.qq.com/s/cN1sfcWFME7S4OJy4VIREg)，[Cell：肠道菌群促进帕金森发生ParkinsonDisease](https://mp.weixin.qq.com/s/OINhALYIaH-JZICpU68icQ)
- [8差异丰度分析gneiss](https://mp.weixin.qq.com/s/wx9dr5e2B_YyqTdPJ7dVsQ)
- [9数据导入Importing data](https://mp.weixin.qq.com/s/u0k38x4lAUaghua2FDD1mQ)
- [10数据导出Exporting data](https://mp.weixin.qq.com/s/pDxDsm8vabpe9KtcLRYWxg)
- [11元数据Metadata](https://mp.weixin.qq.com/s/Q-YTeXH84lgBbRwuzc1bsg)
- [12数据筛选Filtering data](https://mp.weixin.qq.com/s/zk-pXJs4GNwb1AOBPzCaHA)
- [13训练特征分类器Training feature classifiers](https://mp.weixin.qq.com/s/jTRUYgacH5WszsHJVbbh4g)
- [14数据评估和质控Evaluating and controlling](https://mp.weixin.qq.com/s/1b3Hj23bKWfTkHKAPNmCBQ)
- [15样品分类和回归q2-sample-classifier](https://mp.weixin.qq.com/s/3DGvuD3R9atSoo2CSrUJBw)
- [16纵向和成对样本比较q2-longitudinal](https://mp.weixin.qq.com/s/RhRXoGqVuLumxvbba7GgSg)


# 鉴定和过滤嵌合体序列`q2-vsearch`

**Identifying and filtering chimeric feature sequences with q2-vsearch**

https://docs.qiime2.org/2020.2/tutorials/chimera/

> 注：最好按本教程顺序学习，想直接学习本章，至少完成本系列[《1简介和安装》](https://mp.weixin.qq.com/s/vlc2uIaWnPSMhPBeQtPR4w)。

在QIIME 2中进行嵌合体检验基于`FeatureTable[Frequency]`和`FeatureData[Sequences]`对象。QIIME 2内嵌了vsearch的Uchime无参(*de novo*)和有参(reference)去嵌合体流程。对于此过程的细节，详见Uchime的论文和vsearch的帮助文档。(推荐USEARCH软件主页有比较详细的教程，vsearch帮助读起来不方便)

本节使用[《6沙漠土壤分析Atacama soil》](https://mp.weixin.qq.com/s/tmXAjkl7oW3X4uagLOJu2A)中的特征表。
 
## 数据下载

**Obtain the data**

```
mkdir -p qiime2-chimera-filtering-tutorial
cd qiime2-chimera-filtering-tutorial

wget -c \
  -O "atacama-table.qza" \
  "https://data.qiime2.org/2020.2/tutorials/chimera/atacama-table.qza"

wget -c \
  -O "atacama-rep-seqs.qza" \
  "https://data.qiime2.org/2020.2/tutorials/chimera/atacama-rep-seqs.qza"
```

## 无参嵌合体鉴定

**Run de novo chimera checking**

```
# 20s
time qiime vsearch uchime-denovo \
  --i-table atacama-table.qza \
  --i-sequences atacama-rep-seqs.qza \
  --output-dir uchime-dn-out
```

**输入对象:**

- `atacama-rep-seqs.qza`: 代表序列。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fchimera%2Fatacama-rep-seqs.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/chimera/atacama-rep-seqs.qza)
- `atacama-table.qza`: 特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fchimera%2Fatacama-table.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/chimera/atacama-table.qza)
- `uchime-dn-out/nonchimeras.qza`: 去嵌合序列。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fchimera%2Fuchime-dn-out%2Fnonchimeras.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/chimera/uchime-dn-out/nonchimeras.qza)
- `uchime-dn-out/chimeras.qza`: 嵌合序列。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fchimera%2Fuchime-dn-out%2Fchimeras.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/chimera/uchime-dn-out/chimeras.qza)
- `uchime-dn-out/stats.qza`: 统计。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fchimera%2Fuchime-dn-out%2Fstats.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/chimera/uchime-dn-out/stats.qza)

注：基于参考序列(有参，Reference-based)的嵌合体鉴定方法详见[`vsearch uchime-ref`](https://docs.qiime2.org/2020.2/plugins/available/vsearch/uchime-ref/)

## 可视化统计结果 

**Visualize summary stats**

```
qiime metadata tabulate \
  --m-input-file uchime-dn-out/stats.qza \
  --o-visualization uchime-dn-out/stats.qzv
```

**输入可视化:**

- `uchime-dn-out/stats.qzv`: 统计。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fchimera%2Fuchime-dn-out%2Fstats.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/chimera/uchime-dn-out/stats.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.16.01.jpg)

## 过滤特征表和序列

**Filter input tables and sequences**

### 过滤嵌合体和可疑序列

**Exclude chimeras and “borderline chimeras”**

```
qiime feature-table filter-features \
  --i-table atacama-table.qza \
  --m-metadata-file uchime-dn-out/nonchimeras.qza \
  --o-filtered-table uchime-dn-out/table-nonchimeric-wo-borderline.qza
qiime feature-table filter-seqs \
  --i-data atacama-rep-seqs.qza \
  --m-metadata-file uchime-dn-out/nonchimeras.qza \
  --o-filtered-data uchime-dn-out/rep-seqs-nonchimeric-wo-borderline.qza
qiime feature-table summarize \
  --i-table uchime-dn-out/table-nonchimeric-wo-borderline.qza \
  --o-visualization uchime-dn-out/table-nonchimeric-wo-borderline.qzv
```

**输出对象:**

- `uchime-dn-out/rep-seqs-nonchimeric-wo-borderline.qza`：过滤嵌合体的序列。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fchimera%2Fuchime-dn-out%2Frep-seqs-nonchimeric-wo-borderline.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/chimera/uchime-dn-out/rep-seqs-nonchimeric-wo-borderline.qza)
- `uchime-dn-out/table-nonchimeric-wo-borderline.qza`：过滤嵌合体的特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fchimera%2Fuchime-dn-out%2Ftable-nonchimeric-wo-borderline.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/chimera/uchime-dn-out/table-nonchimeric-wo-borderline.qza)

**输出可视化结果:**

- `uchime-dn-out/table-nonchimeric-wo-borderline.qzv`：特征表统计。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fchimera%2Fuchime-dn-out%2Ftable-nonchimeric-wo-borderline.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/chimera/uchime-dn-out/table-nonchimeric-wo-borderline.qzv)

### 过滤嵌合但保留可疑序列

**Exclude chimeras but retain “borderline chimeras”**

```
qiime feature-table filter-features \
  --i-table atacama-table.qza \
  --m-metadata-file uchime-dn-out/chimeras.qza \
  --p-exclude-ids \
  --o-filtered-table uchime-dn-out/table-nonchimeric-w-borderline.qza
qiime feature-table filter-seqs \
  --i-data atacama-rep-seqs.qza \
  --m-metadata-file uchime-dn-out/chimeras.qza \
  --p-exclude-ids \
  --o-filtered-data uchime-dn-out/rep-seqs-nonchimeric-w-borderline.qza
qiime feature-table summarize \
  --i-table uchime-dn-out/table-nonchimeric-w-borderline.qza \
  --o-visualization uchime-dn-out/table-nonchimeric-w-borderline.qzv
```


**输出对象:**

- `uchime-dn-out/table-nonchimeric-w-borderline.qza`：过滤嵌合体的序列。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fchimera%2Fuchime-dn-out%2Ftable-nonchimeric-w-borderline.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/chimera/uchime-dn-out/table-nonchimeric-w-borderline.qza)
- `uchime-dn-out/rep-seqs-nonchimeric-w-borderline.qza`：过滤嵌合体的特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fchimera%2Fuchime-dn-out%2Frep-seqs-nonchimeric-w-borderline.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/chimera/uchime-dn-out/rep-seqs-nonchimeric-w-borderline.qza)

**输出可视化结果:**

- `uchime-dn-out/table-nonchimeric-w-borderline.qzv`：特征表统计。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fchimera%2Fuchime-dn-out%2Ftable-nonchimeric-w-borderline.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/chimera/uchime-dn-out/table-nonchimeric-w-borderline.qzv)


## Reference

https://docs.qiime2.org/2020.2/

Evan Bolyen*, Jai Ram Rideout*, Matthew R. Dillon*, Nicholas A. Bokulich*, Christian C. Abnet, Gabriel A. Al-Ghalith, Harriet Alexander, Eric J. Alm, Manimozhiyan Arumugam, Francesco Asnicar, Yang Bai, Jordan E. Bisanz, Kyle Bittinger, Asker Brejnrod, Colin J. Brislawn, C. Titus Brown, Benjamin J. Callahan, Andrés Mauricio Caraballo-Rodríguez, John Chase, Emily K. Cope, Ricardo Da Silva, Christian Diener, Pieter C. Dorrestein, Gavin M. Douglas, Daniel M. Durall, Claire Duvallet, Christian F. Edwardson, Madeleine Ernst, Mehrbod Estaki, Jennifer Fouquier, Julia M. Gauglitz, Sean M. Gibbons, Deanna L. Gibson, Antonio Gonzalez, Kestrel Gorlick, Jiarong Guo, Benjamin Hillmann, Susan Holmes, Hannes Holste, Curtis Huttenhower, Gavin A. Huttley, Stefan Janssen, Alan K. Jarmusch, Lingjing Jiang, Benjamin D. Kaehler, Kyo Bin Kang, Christopher R. Keefe, Paul Keim, Scott T. Kelley, Dan Knights, Irina Koester, Tomasz Kosciolek, Jorden Kreps, Morgan G. I. Langille, Joslynn Lee, Ruth Ley, **Yong-Xin Liu**, Erikka Loftfield, Catherine Lozupone, Massoud Maher, Clarisse Marotz, Bryan D. Martin, Daniel McDonald, Lauren J. McIver, Alexey V. Melnik, Jessica L. Metcalf, Sydney C. Morgan, Jamie T. Morton, Ahmad Turan Naimey, Jose A. Navas-Molina, Louis Felix Nothias, Stephanie B. Orchanian, Talima Pearson, Samuel L. Peoples, Daniel Petras, Mary Lai Preuss, Elmar Pruesse, Lasse Buur Rasmussen, Adam Rivers, Michael S. Robeson, Patrick Rosenthal, Nicola Segata, Michael Shaffer, Arron Shiffer, Rashmi Sinha, Se Jin Song, John R. Spear, Austin D. Swafford, Luke R. Thompson, Pedro J. Torres, Pauline Trinh, Anupriya Tripathi, Peter J. Turnbaugh, Sabah Ul-Hasan, Justin J. J. van der Hooft, Fernando Vargas, Yoshiki Vázquez-Baeza, Emily Vogtmann, Max von Hippel, William Walters, Yunhu Wan, Mingxun Wang, Jonathan Warren, Kyle C. Weber, Charles H. D. Williamson, Amy D. Willis, Zhenjiang Zech Xu, Jesse R. Zaneveld, Yilong Zhang, Qiyun Zhu, Rob Knight & J. Gregory Caporaso#. Reproducible, interactive, scalable and extensible microbiome data science using QIIME 2. ***Nature Biotechnology***. 2019, 37: 852-857. doi:[10.1038/s41587-019-0209-9](https://doi.org/10.1038/s41587-019-0209-9)

## 译者简介

**刘永鑫**，博士。2008年毕业于东北农大微生物学，2014年于中科院遗传发育所获生物信息学博士，2016年遗传学博士后出站留所工作，任宏基因组学实验室工程师。目前主要研究方向为微生物组数据分析、分析方法开发与优化和科学传播，QIIME 2项目参与人。目前在***Science、Nature Biotechnology、Cell Host & Microbe、Current Opinion in Microbiology*** 等杂志发表论文20余篇。2017年7月创办“宏基因组”公众号，目前分享宏基因组、扩增子原创文章500余篇，代表博文有[《扩增子图表解读、分析流程和统计绘图三部曲(21篇)》](https://mp.weixin.qq.com/s/u7PQn2ilsgmA6Ayu-oP1tw)、[《Nature综述：手把手教你分析菌群数据(1.8万字)》](https://mp.weixin.qq.com/s/F8Anj9djawaFEUQKkdE1lg)、[《QIIME2中文教程(22篇)》](https://mp.weixin.qq.com/s/UFLNaJtFPH-eyd1bLRiPTQ)等，关注人数8万+，累计阅读1300万+。


## 猜你喜欢

- 10000+: [菌群分析](https://mp.weixin.qq.com/s/F8Anj9djawaFEUQKkdE1lg)  
[宝宝与猫狗](http://mp.weixin.qq.com/s/K3y3an-EaX8iaytmxdzHqA) [提DNA发Nature](http://mp.weixin.qq.com/s/lO5uiMjixJ6aYTjPX-IyaQ) [实验分析谁对结果影响大](http://mp.weixin.qq.com/s/cL_IAoPFfmelKMPMgltrfA)  [Cell微生物专刊](https://mp.weixin.qq.com/s/fN0gpD3bZJDXSp8x4ck-3Q) [肠道指挥大脑](https://mp.weixin.qq.com/s/pZO20VGl3Tf_OtFIbZ-zWw)
- 系列教程：[微生物组入门](http://mp.weixin.qq.com/s/sQyl5EctXFB95Oxg8YIasg) [Biostar](http://mp.weixin.qq.com/s/JL-n2nD6YL8vwuRtTVmQlQ) [微生物组](http://mp.weixin.qq.com/s/li7SdZVaCEyFQF8h6MMh2A)  [宏基因组](http://mp.weixin.qq.com/s/bcyvhFrNr6niqD13rQfZeg) 
- 专业技能：[生信宝典](http://mp.weixin.qq.com/s/2b3_8Vvv7McqCkEfUszW3A) [学术图表](http://mp.weixin.qq.com/s/SCT4oso_vI0UNIJZTaG95g) [高分文章](http://mp.weixin.qq.com/s/kD-x7K4hI5KMgGXikyLt0Q) [不可或缺的人](http://mp.weixin.qq.com/s/1nf7vwyvC3oemkTq_pu87A) 
- 一文读懂：[宏基因组](http://mp.weixin.qq.com/s/Vsm6BJgqsSvxEenIBrGVLw) [寄生虫益处](https://mp.weixin.qq.com/s/hX0K9TOLPnrZ6f8lUoSYag) [进化树](https://mp.weixin.qq.com/s/GV8rU3FZdc8Y-x931k_yrQ)
- 必备技能：[提问](http://mp.weixin.qq.com/s/xCif04bqZB14Z4OvesK0SQ) [搜索](http://mp.weixin.qq.com/s/wn2bqIPgT5UD-GP1qzkJFA)  [Endnote](http://mp.weixin.qq.com/s/SPblPs5ByPdb2C400kIK3w)
- 文献阅读 [热心肠](http://mp.weixin.qq.com/s/1uBeAQ0utxuzTTtfUx_UXA) [SemanticScholar](https://mp.weixin.qq.com/s/gaQiUrRqLpfTXzjyfbua6A) [Geenmedical](https://mp.weixin.qq.com/s/hc8g64aHN7qv8YhVfrsuvQ)
- 扩增子分析：[图表解读](http://mp.weixin.qq.com/s/oiVHO2S1JgYrKXPDU6fH2g) [分析流程](http://mp.weixin.qq.com/s/KrYyy3jjzAL0rQzVfV6h4A) [统计绘图](http://mp.weixin.qq.com/s/6tNePiaDsPPzEBZjiCXIRg) 
- [16S功能预测](http://mp.weixin.qq.com/s/sztbvfdf9wa-3HJXc_m8TQ)   [PICRUSt](https://mp.weixin.qq.com/s/LWtiwBbUCAadMZPaKKDMag)  [FAPROTAX](http://mp.weixin.qq.com/s/J8EwJD_PTDhqRaD7kXlK1A)  [Bugbase](https://mp.weixin.qq.com/s/1WdysPZWo0H6NSYiNpcMUQ) [Tax4Fun](http://mp.weixin.qq.com/s/dzsh44ue93xnAs7gTde7wg)
- 在线工具：[16S预测培养基](http://mp.weixin.qq.com/s/YIrDqNvDX0XMazCGxhH1Lg) [生信绘图](http://mp.weixin.qq.com/s/O0QAQyfxnrXlFLw268B7lg)
- 科研经验：[云笔记](http://mp.weixin.qq.com/s/OnwhWlq3cTycf-W1rxgV7g)  [云协作](http://mp.weixin.qq.com/s/W5By9mZ5PI57_xFfZ_JXiw) [公众号](http://mp.weixin.qq.com/s/hd0sdBDAMqMJsXQs0pIjUg)
- 编程模板: [Shell](http://mp.weixin.qq.com/s/YevGR79NnBAF-xtrqL8gAA)  [R](http://mp.weixin.qq.com/s/OQiE882jM6pVwqTiIjyZ1Q) [Perl](http://mp.weixin.qq.com/s/u2ZmTo-z6cbN-L6KVLYNwg) 
- 生物科普: [肠道细菌](http://mp.weixin.qq.com/s/3T768LA6MWujF4yuzK4MKQ) [人体上的生命](http://mp.weixin.qq.com/s/_DUI6tOYTEq0Wu7K7iRTxw) [生命大跃进](http://mp.weixin.qq.com/s/O_0Il0G_v_aSwkUH_noZVA)  [细胞暗战](http://mp.weixin.qq.com/s/M35ebWAelDIK5Iqib06JzA) [人体奥秘](https://mp.weixin.qq.com/s/xlCdN8il1hcutkYK-42fAQ)  

## 写在后面

为鼓励读者交流、快速解决科研困难，我们建立了“宏基因组”专业讨论群，目前己有国内外5000+ 一线科研人员加入。参与讨论，获得专业解答，欢迎分享此文至朋友圈，并扫码加主编好友带你入群，务必备注“姓名-单位-研究方向-职称/年级”。技术问题寻求帮助，首先阅读[《如何优雅的提问》](http://mp.weixin.qq.com/s/H9gkepap0hy3NNskOkO44w)学习解决问题思路，仍末解决群内讨论，问题不私聊，帮助同行。
![image](http://bailab.genetics.ac.cn/markdown/life/yongxinliu.jpg)

学习扩增子、宏基因组科研思路和分析实战，关注“宏基因组”
![image](http://bailab.genetics.ac.cn/markdown/life/metagenome.jpg)

![image](http://bailab.genetics.ac.cn/markdown/train/1809/201807.jpg)

点击阅读原文，跳转最新文章目录阅读
https://mp.weixin.qq.com/s/5jQspEvH5_4Xmart22gjMA