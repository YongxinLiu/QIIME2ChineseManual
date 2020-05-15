[TOC]

# 前情提要

- [NBT：QIIME 2可重复、交互式的微生物组分析平台](https://mp.weixin.qq.com/s/-_FHxF1XUBNF4qMV1HLPkg)
- [1简介和安装Introduction&Install](https://mp.weixin.qq.com/s/vlc2uIaWnPSMhPBeQtPR4w)
- [2插件工作流程概述Workflow](https://mp.weixin.qq.com/s/qXlx1a8OQN9Ar7HYIC3OqQ)
- [3老司机上路指南Experienced](https://mp.weixin.qq.com/s/gJZCRzenCplCiOsDRHLhjw)
- [4人体各部位微生物组分析Moving Pictures](https://mp.weixin.qq.com/s/c8ZQegtfNBHZRVjjn5Gyrw)
- [Genome Biology：人体各部位微生物组时间序列分析](https://mp.weixin.qq.com/s/DhecHNqv4UjYpVEu48oXAw)
- [5粪菌移植分析练习FMT](https://mp.weixin.qq.com/s/cqzpLOprpClaib1FvH7bjg)
- [Microbiome：粪菌移植改善自闭症](https://mp.weixin.qq.com/s/PHpg0y6_mydtCXYUwZa2Yg)
- [6沙漠土壤分析Atacama soil](https://mp.weixin.qq.com/s/tmXAjkl7oW3X4uagLOJu2A)
- [mSystems：干旱对土壤微生物组的影响](https://mp.weixin.qq.com/s/3tF6_CfSKBbtLQU4G3NpEQ)
- [7帕金森小鼠教程Parkinson's Mouse](https://mp.weixin.qq.com/s/cN1sfcWFME7S4OJy4VIREg)
- [Cell：肠道菌群促进帕金森发生ParkinsonDisease](https://mp.weixin.qq.com/s/OINhALYIaH-JZICpU68icQ)
- [8差异丰度分析gneiss](https://mp.weixin.qq.com/s/wx9dr5e2B_YyqTdPJ7dVsQ)
- [9数据导入Importing data](https://mp.weixin.qq.com/s/u0k38x4lAUaghua2FDD1mQ)
- [10数据导出Exporting data](https://mp.weixin.qq.com/s/pDxDsm8vabpe9KtcLRYWxg)
- [11元数据Metadata](https://mp.weixin.qq.com/s/Q-YTeXH84lgBbRwuzc1bsg)
- [12数据筛选Filtering data](https://mp.weixin.qq.com/s/zk-pXJs4GNwb1AOBPzCaHA)
- [13训练特征分类器Training feature classifiers](https://mp.weixin.qq.com/s/jTRUYgacH5WszsHJVbbh4g)
- [14数据评估和质控Evaluating and controlling](https://mp.weixin.qq.com/s/1b3Hj23bKWfTkHKAPNmCBQ)
- [15样品分类和回归q2-sample-classifier](https://mp.weixin.qq.com/s/3DGvuD3R9atSoo2CSrUJBw)
- [16纵向和成对样本比较q2-longitudinal](https://mp.weixin.qq.com/s/RhRXoGqVuLumxvbba7GgSg)
- [17鉴定和过滤嵌合体序列q2-vsearch](https://mp.weixin.qq.com/s/4FvR7qGTfVFdSkdKtR6_LQ)
- [18序列双端合并read-joining](https://mp.weixin.qq.com/s/xjl41rAlqMwyZSoPBX6Tww)
- [19使用q2-vsearch聚类OTUs](https://mp.weixin.qq.com/s/LewtnbZlJNHw9M8Bakuyeg)
- [20实用程序Utilities](https://mp.weixin.qq.com/s/kSuK4njtfGN_Ph9rmF88Lw)
- [21进化树推断q2-phylogeny](https://mp.weixin.qq.com/s/JvffqGdtae3FKmd_aI0K6w)


# 命令行界面`q2cli`

**QIIME 2 command-line interface (q2cli)**

https://docs.qiime2.org/2020.2/interfaces/q2cli/

> 注：最好按本教程顺序学习，想直接学习本章，至少完成本系列[《1简介和安装》](https://mp.weixin.qq.com/s/vlc2uIaWnPSMhPBeQtPR4w)。

本指南介绍了`q2cli`，它是QIIME 2 Core发行版中包含的QIIME 2命令行界面。 教程广泛使用q2cli，因此建议在开始教程之前先阅读本文档。 本文档尚在开发中，将来会扩展。

## 基本用法 Basic usage

`q2cli`包含一个qiime命令，该命令用于从命令行执行QIIME分析。 运行qiime查看可用子命令的列表：

    qiime

显示如下内容：

    Usage: qiime [OPTIONS] COMMAND [ARGS]...
    
      QIIME 2 command-line interface (q2cli)
      --------------------------------------
    
      To get help with QIIME 2, visit https://qiime2.org.
    
      To enable tab completion in Bash, run the following command or add it to
      your .bashrc/.bash_profile:
    
          source tab-qiime
    
      To enable tab completion in ZSH, run the following commands or add them to
      your .zshrc:
    
          autoload bashcompinit && bashcompinit && source tab-qiime
    
    Options:
      --version   Show the version and exit.
      --help      Show this message and exit.
    
    Commands:
      info                Display information about current deployment.
      tools               Tools for working with QIIME 2 files.
      dev                 Utilities for developers and advanced users.
      alignment           Plugin for generating and manipulating alignments.
      composition         Plugin for compositional data analysis.
      cutadapt            Plugin for removing adapter sequences, primers, and
                          other unwanted sequence from sequence data.
      dada2               Plugin for sequence quality control with DADA2.
      deblur              Plugin for sequence quality control with Deblur.
      demux               Plugin for demultiplexing & viewing sequence quality.
      diversity           Plugin for exploring community diversity.
      emperor             Plugin for ordination plotting with Emperor.
      feature-classifier  Plugin for taxonomic classification.
      feature-table       Plugin for working with sample by feature tables.
      fragment-insertion  Plugin for extending phylogenies.
      gneiss              Plugin for building compositional models.
      longitudinal        Plugin for paired sample and time series analyses.
      metadata            Plugin for working with Metadata.
      phylogeny           Plugin for generating and manipulating phylogenies.
      quality-control     Plugin for quality control of feature and sequence data.
      quality-filter      Plugin for PHRED-based filtering and trimming.
      sample-classifier   Plugin for machine learning prediction of sample
                          metadata.
      taxa                Plugin for working with feature taxonomy annotations.
      vsearch             Plugin for clustering and dereplicating with vsearch.


将列出几个子命令，包括插件命令（例如`feature-table`, `diversity`）和内置命令（例如`info`, `tools`）。

您可以通过运行`qiime info`来发现当前安装了哪些插件以及有关QIIME部署的其他信息：

    qiime info

显示如下内容：

    System versions
    Python version: 3.6.7
    QIIME 2 release: 2020.2
    QIIME 2 version: 2020.2.0
    q2cli version: 2020.2.0
    
    Installed plugins
    alignment: 2020.2.0
    composition: 2020.2.0
    cutadapt: 2020.2.0
    dada2: 2020.2.0
    deblur: 2020.2.0
    demux: 2020.2.0
    diversity: 2020.2.0
    emperor: 2020.2.0
    feature-classifier: 2020.2.0
    feature-table: 2020.2.0
    fragment-insertion: 2020.2.0
    gneiss: 2020.2.0
    longitudinal: 2020.2.0
    metadata: 2020.2.0
    phylogeny: 2020.2.0
    quality-control: 2020.2.0
    quality-filter: 2020.2.0
    sample-classifier: 2020.2.0
    taxa: 2020.2.0
    types: 2020.2.0
    vsearch: 2020.2.0


向任何命令提供`--help`以显示有关该命令的信息，包括该命令定义的所有子命令，选项和参数。 例如，要了解有关`feature-table` 插件命令的更多信息，请运行：

    qiime feature-table --help

显示如下内容：

    Usage: qiime feature-table [OPTIONS] COMMAND [ARGS]...
    
      Description: This is a QIIME 2 plugin supporting operations on sample by
      feature tables, such as filtering, merging, and transforming tables.
    
      Plugin website: https://github.com/qiime2/q2-feature-table
    
      Getting user support: Please post to the QIIME 2 forum for help with this
      plugin: https://forum.qiime2.org
    
    Options:
      --version    Show the version and exit.
      --citations  Show citations and exit.
      --help       Show this message and exit.
    
    Commands:
      core-features       Identify core features in table
      filter-features     Filter features from table
      filter-samples      Filter samples from table
      filter-seqs         Filter features from sequences
      group               Group samples or features by a metadata column
      heatmap             Generate a heatmap representation of a feature table
      merge               Combine multiple tables
      merge-seqs          Combine collections of feature sequences
      merge-taxa          Combine collections of feature taxonomies
      presence-absence    Convert to presence/absence
      rarefy              Rarefy table
      relative-frequency  Convert to relative frequencies
      subsample           Subsample table
      summarize           Summarize table
      tabulate-seqs       View sequence associated with each feature
      transpose           Transpose a feature table.

这将列出`feature-table`插件提供的操作（子命令），以及有关插件本身的信息（例如引文，网站，用户支持）。

尝试使用`--help`了解其他命令。 例如，内置工具命令中有哪些可用操作？

## 开启命令行补全Enable command-line tab completion

如果将Bash或Zsh用作Shell，则可以启用制表符补全功能，这将大大提高QIIME 2命令行界面（command-line interface，CLI）的可用性。启用制表符补全功能后，按Tab键将尝试完成您键入的命令或选项，或者根据到目前为止键入的内容为您提供可用命令或选项的列表。这减少了您必须执行的键入操作的数量，并使命令和选项更易于发现，而无需将--help传递给要运行的每个命令。

> 提示：当前仅在Bash和Zsh Shell中支持QIIME 2 CLI选项补全。要检查您拥有什么Shell，请运行`echo $0`。您应该在输出中看到`-bash`或`-zsh`(例如我看到的是`/bin/bash`)。

请选择适合对说明对应的Shell，方可启用制表符补全。

### Bash

运行以下命令以启用制表符完成：

    source tab-qiime
    
每次打开新终端并激活QIIME 2 conda环境时，除非将其添加到您的`.bashrc / .bash_profile`中，否则都将需要运行此命令。

### Zsh

运行以下命令以启用制表符完成：

    autoload bashcompinit && bashcompinit && source tab-qiime

除非将其添加到`.zshrc`中，否则每次打开新终端并激活QIIME 2 conda环境时，都需要运行此命令。

### 验证标签页完成 Verify tab completion

要测试选项卡补全功能是否正常运行，请尝试键入以下部分命令，而无需实际运行该命令，请按Tab键（您可能需要按几次）。如果制表符补全有效，则命令应自动补齐`qiime info`。

    qiime i

## Reference

https://docs.qiime2.org/2020.2

Evan Bolyen*, Jai Ram Rideout*, Matthew R. Dillon*, Nicholas A. Bokulich*, Christian C. Abnet, Gabriel A. Al-Ghalith, Harriet Alexander, Eric J. Alm, Manimozhiyan Arumugam, Francesco Asnicar, Yang Bai, Jordan E. Bisanz, Kyle Bittinger, Asker Brejnrod, Colin J. Brislawn, C. Titus Brown, Benjamin J. Callahan, Andrés Mauricio Caraballo-Rodríguez, John Chase, Emily K. Cope, Ricardo Da Silva, Christian Diener, Pieter C. Dorrestein, Gavin M. Douglas, Daniel M. Durall, Claire Duvallet, Christian F. Edwardson, Madeleine Ernst, Mehrbod Estaki, Jennifer Fouquier, Julia M. Gauglitz, Sean M. Gibbons, Deanna L. Gibson, Antonio Gonzalez, Kestrel Gorlick, Jiarong Guo, Benjamin Hillmann, Susan Holmes, Hannes Holste, Curtis Huttenhower, Gavin A. Huttley, Stefan Janssen, Alan K. Jarmusch, Lingjing Jiang, Benjamin D. Kaehler, Kyo Bin Kang, Christopher R. Keefe, Paul Keim, Scott T. Kelley, Dan Knights, Irina Koester, Tomasz Kosciolek, Jorden Kreps, Morgan G. I. Langille, Joslynn Lee, Ruth Ley, **Yong-Xin Liu**, Erikka Loftfield, Catherine Lozupone, Massoud Maher, Clarisse Marotz, Bryan D. Martin, Daniel McDonald, Lauren J. McIver, Alexey V. Melnik, Jessica L. Metcalf, Sydney C. Morgan, Jamie T. Morton, Ahmad Turan Naimey, Jose A. Navas-Molina, Louis Felix Nothias, Stephanie B. Orchanian, Talima Pearson, Samuel L. Peoples, Daniel Petras, Mary Lai Preuss, Elmar Pruesse, Lasse Buur Rasmussen, Adam Rivers, Michael S. Robeson, Patrick Rosenthal, Nicola Segata, Michael Shaffer, Arron Shiffer, Rashmi Sinha, Se Jin Song, John R. Spear, Austin D. Swafford, Luke R. Thompson, Pedro J. Torres, Pauline Trinh, Anupriya Tripathi, Peter J. Turnbaugh, Sabah Ul-Hasan, Justin J. J. van der Hooft, Fernando Vargas, Yoshiki Vázquez-Baeza, Emily Vogtmann, Max von Hippel, William Walters, Yunhu Wan, Mingxun Wang, Jonathan Warren, Kyle C. Weber, Charles H. D. Williamson, Amy D. Willis, Zhenjiang Zech Xu, Jesse R. Zaneveld, Yilong Zhang, Qiyun Zhu, Rob Knight & J. Gregory Caporaso#. Reproducible, interactive, scalable and extensible microbiome data science using QIIME 2. ***Nature Biotechnology***. 2019, 37: 852-857. doi:[10.1038/s41587-019-0209-9](https://doi.org/10.1038/s41587-019-0209-9)

## 译者简介

**刘永鑫**，博士。2008年毕业于东北农业大学微生物学专业，2014年于中国科学院大学获生物信息学博士学位，2016年中科院遗传发育所博士后出站留所任工程师。目前主要研究方向有微生物组数据分析、方法开发和科学传播。目前以第一作者(含共同)或微生物组数据分析负责人在[**Science**](https://mp.weixin.qq.com/s/KmMDEmptBKz8Fv7VSdz2Jg)、[**Nature Biotechnology**](https://mp.weixin.qq.com/s/s7Q1_MeodqJ0hjwDumeiXQ)、[**Cell Host & Microbe**](https://mp.weixin.qq.com/s/DgVe1VAZVqOMqCMuU3kEeQ) 等杂志发表论文20余篇，引用千余次。作为中国唯一单位代表参与[微生物组分析平台**QIIME 2**开发](https://mp.weixin.qq.com/s/-_FHxF1XUBNF4qMV1HLPkg)。受邀以第一作者和/或通讯作者(含共同)在[**Protein & Cell**](https://doi.org/10.1007/s13238-020-00724-8)、[**Current Opinion in Microbiology**](https://mp.weixin.qq.com/s/-gXoRIy6ZuEmHH6txH8txA)、[**遗传**](https://mp.weixin.qq.com/s/3XFmRe4l2uZrHZexx0Ou-g) 等杂志发表微生物组研究方法综述。2017年7月创办“宏基因组”公众号，目前分享本领域相关原创文章1800余篇，代表作品有[《微生物组图表解读、分析流程和统计绘图》](https://mp.weixin.qq.com/s/u7PQn2ilsgmA6Ayu-oP1tw)、[《QIIME2中文教程》](https://mp.weixin.qq.com/s/-_FHxF1XUBNF4qMV1HLPkg)等系列，关注人数9万+，累计阅读1400万+。

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