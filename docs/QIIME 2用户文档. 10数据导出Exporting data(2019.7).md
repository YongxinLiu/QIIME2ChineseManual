[TOC]

# 前情提要

- [NBT：QIIME 2可重复、交互和扩展的微生物组数据分析平台](https://mp.weixin.qq.com/s/HCfXbJvu3KKS0wfw0NEzZw) 
- [1简介和安装Introduction&Install](https://mp.weixin.qq.com/s/xmfoA7MCSoRlnKJJgH823g)
- [2插件工作流程概述Workflow](https://mp.weixin.qq.com/s/6j3EIeL1XHxBkrrY0pDNMQ)
- [3老司机上路指南Experienced](https://mp.weixin.qq.com/s/Njw2Uj66JViqigC3T6nGFw)
- [4人体各部位微生物组分析Moving Pictures](https://mp.weixin.qq.com/s/U-B5mIDJzOLpbm4DOfcqXA) 
- [Genome Biology：人体各部位微生物组时间序列分析](https://mp.weixin.qq.com/s/DsqU8q5cb78P8tBKkFuC6w)
- [5粪菌移植分析练习FMT](https://mp.weixin.qq.com/s/TCZiqYOBdWdB1QlTnLHOjQ) 
- [Microbiome：粪菌移植改善自闭症](https://mp.weixin.qq.com/s/VXy9haFsnnMVlyXLULy52w)
- [6沙漠土壤分析Atacama soil](https://mp.weixin.qq.com/s/gB0Y8P0uzpIA1pml9nSf7g) 
- [mSystems：干旱对土壤微生物组的影响](https://mp.weixin.qq.com/s/j86yqVOaZQYLKf2Ls-N6-w)
- [7帕金森小鼠教程Parkinson's Mouse](https://mp.weixin.qq.com/s/Du9UUJ9prnpHXTwqmlIe0g)
- [Cell：肠道菌群促进帕金森发生ParkinsonDisease](https://mp.weixin.qq.com/s/YO6f3vTOK-1W6f-AFAO97w)
- [8差异丰度分析gneiss](https://mp.weixin.qq.com/s/i4RZkLKeMcWohywrmXDbPA)
- [9数据导入Importing data](https://mp.weixin.qq.com/s/b8jBAoR5F66hkQyYaZhLJQ)

# QIIME 2用户文档. 9数据导出

https://docs.qiime2.org/2019.7/tutorials/exporting/

**Exporting data**

> 注：最好按本教程顺序学习，想直接学习本章，至少完成本系列[1简介和安装](https://mp.weixin.qq.com/s/xmfoA7MCSoRlnKJJgH823g)。

为了使用QIIME 2，输入数据必须存储在QIIME 2对象（即`qza`文件）中。这是支持分布式、自动来源跟踪、语义类型验证和数据格式之间的转换的基础（有关QIIME 2对象的更多详细信息，请参阅[核心概念页](https://mp.weixin.qq.com/s/xmfoA7MCSoRlnKJJgH823g)）。

有时，您需要从QIIME 2对象中导出数据，例如使用不同的微生物组分析程序分析数据，或在R中进行统计分析。这可以通过使用`qiime tools export`命令来实现，该命令以QIIME 2对象（.qza）文件和输出目录作为输入。对象中的数据将根据特定对象导出一个或多个文件。

> 注意: 当从QIIME 2对象导出数据时，将不再有与数据相关的来源。如果随后重新导入数据，则与新对象关联的源将从导入步骤开始，并且所有现有的来源信息都将丢失。因此，最好只在使用QIIME 2完成所有可以实现的处理步骤后，再从对象中导出数据，以最大化每个对象的来源追溯。

以下部分提供了从QIIME 2对象导出数据的示例。可以从任何QIIME 2对象或可视化中导出数据；该过程与下面描述的过程相同。

> 详者注：为什么要导出文件？
QIIME2采用统一`qza`文件格式，是为了保证文件格式统一和分析流程可追溯。但不可能要求每个人都用此需系统，而且此系统的功能也不是万能的，需要导出其它软件兼容的格式，方便交流和其它用户开展个性化的分析。

**启动工作环境并创建工作目录**

```
# 定义工作目录变量，方便以后多次使用
wd=~/github/QIIME2ChineseManual/2019.7
mkdir -p $wd
# 进入工作目录，是不是很简介，这样无论你在什么位置就可以快速回到项目文件夹
cd $wd

# 方法1. 进入QIIME 2 conda工作环境
conda activate qiime2-2019.7
# 这时我们的命令行前面出现 (qiime2-2019.7) 表示成功进入工作环境

# 方法2. conda版本较老用户，使用source进入QIIME 2
source activate qiime2-2019.7

# 方法3. 如果是docker安装的请运行如下命令，默认加载当前目录至/data目录
docker run --rm -v $(pwd):/data --name=qiime -it  qiime2/core:2019.7

# 建立工作目录
mkdir -p qiime2-exporting-tutorial
cd qiime2-exporting-tutorial
```

## 导出特征表

**Exporting a feature table**

导出`FeatureTable[Frequency]`对象为BIOM v2.1格式

```
wget \
  -O "feature-table.qza" \
  "https://data.qiime2.org/2019.7/tutorials/exporting/feature-table.qza"
  
qiime tools export \
  --input-path feature-table.qza \
  --output-path exported-feature-table
```

- `feature-table.qza`：QIIME 2特征表文件。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2019.7%2Fdata%2Ftutorials%2Fexporting%2Ffeature-table.qza) | [下载](https://docs.qiime2.org/2019.7/data/tutorials/exporting/feature-table.qza)

> 详者注

导出的biom文件位于`exported-feature-table`文件夹中，名为feature-table.biom，可用biom程序对文件进行格式转换和分析，可参阅以下教程：

- [BIOM：生物观测矩阵——微生物组数据通用数据格式](https://mp.weixin.qq.com/s/R1lDzm8eSBibhL8PkDSJJA)

BIOM 2.1格式也是HDF5格式，为二进制，无法直接查看，必须转换为文本阅读。

biom转换biom为tsv格式

    biom convert -i exported-feature-table/feature-table.biom -o exported-feature-table/feature-table.txt --to-tsv

查看文件`less -S exported-feature-table/feature-table.txt`

    # Constructed from biom file
    #OTU ID K3.H    K3.Z    M2.Middle.L     K3.A    K3.R    K3.V
    New.CleanUp.ReferenceOTU0       2.0     0.0     0.0     0.0 
    New.CleanUp.ReferenceOTU1       0.0     1.0     6.0     1.0 
    New.CleanUp.ReferenceOTU3       0.0     0.0     0.0     0.0 

同理tsv转换为biom的代码如下：

    biom convert -i exported-feature-table/feature-table.txt -o table.from_txt_hdf5.biom --table-type="OTU table" --to-hdf5


## 导出进化树

**Exporting a phylogenetic tree**

导出`Phylogeny[Unrooted]`对象为newick格式

```
wget \
  -O "unrooted-tree.qza" \
  "https://data.qiime2.org/2019.7/tutorials/exporting/unrooted-tree.qza"
  
qiime tools export \
  --input-path unrooted-tree.qza \
  --output-path exported-tree
```

- `unrooted-tree.qza`：无根树文件。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2019.7%2Fdata%2Ftutorials%2Fexporting%2Funrooted-tree.qza) | [下载](https://docs.qiime2.org/2019.7/data/tutorials/exporting/unrooted-tree.qza)


导文件为`exported-tree/tree.nwk`，是标准树nwk文件

```
(((New.CleanUp.ReferenceOTU1480:0.11995,(New.CleanUp.ReferenceOTU202:0.04479,
New.CleanUp.ReferenceOTU432:0.0049)0.769:0.04661)1:0.26705,
((New.CleanUp.ReferenceOTU1150:0.00016,(New.CleanUp.ReferenceOTU782:0.04264,(New.CleanUp.ReferenceOTU643:0.10438,
(((New.CleanUp.ReferenceOTU1014:0.01521,New.CleanUp.ReferenceOTU270:0.02738)0.879:0.02315,(((New.CleanUp.ReferenceOTU1008:0.0378
```

## 导出与提取

**Exporting versus extracting**

提取包括所有的信息文件，如下例中的特征表文件，结果即包括特征表，又包括生成此文件的相关软件版本信息，还有生成此文件所有步骤的文件说明。

```
mkdir -p extracted-feature-table
qiime tools extract \
  --input-path feature-table.qza \
  --output-path extracted-feature-table
```

解压/提取目录包括一个对象编号UUID的目录，里面有所有文件。

推荐使用 https://view.qiime2.org 在线查看结果，可以图形化展示分析流程的追溯。


## Reference

https://docs.qiime2.org/2019.7

Evan Bolyen*, Jai Ram Rideout*, Matthew R. Dillon*, Nicholas A. Bokulich*, Christian C. Abnet, Gabriel A. Al-Ghalith, Harriet Alexander, Eric J. Alm, Manimozhiyan Arumugam, Francesco Asnicar, Yang Bai, Jordan E. Bisanz, Kyle Bittinger, Asker Brejnrod, Colin J. Brislawn, C. Titus Brown, Benjamin J. Callahan, Andrés Mauricio Caraballo-Rodríguez, John Chase, Emily K. Cope, Ricardo Da Silva, Christian Diener, Pieter C. Dorrestein, Gavin M. Douglas, Daniel M. Durall, Claire Duvallet, Christian F. Edwardson, Madeleine Ernst, Mehrbod Estaki, Jennifer Fouquier, Julia M. Gauglitz, Sean M. Gibbons, Deanna L. Gibson, Antonio Gonzalez, Kestrel Gorlick, Jiarong Guo, Benjamin Hillmann, Susan Holmes, Hannes Holste, Curtis Huttenhower, Gavin A. Huttley, Stefan Janssen, Alan K. Jarmusch, Lingjing Jiang, Benjamin D. Kaehler, Kyo Bin Kang, Christopher R. Keefe, Paul Keim, Scott T. Kelley, Dan Knights, Irina Koester, Tomasz Kosciolek, Jorden Kreps, Morgan G. I. Langille, Joslynn Lee, Ruth Ley, **Yong-Xin Liu**, Erikka Loftfield, Catherine Lozupone, Massoud Maher, Clarisse Marotz, Bryan D. Martin, Daniel McDonald, Lauren J. McIver, Alexey V. Melnik, Jessica L. Metcalf, Sydney C. Morgan, Jamie T. Morton, Ahmad Turan Naimey, Jose A. Navas-Molina, Louis Felix Nothias, Stephanie B. Orchanian, Talima Pearson, Samuel L. Peoples, Daniel Petras, Mary Lai Preuss, Elmar Pruesse, Lasse Buur Rasmussen, Adam Rivers, Michael S. Robeson, Patrick Rosenthal, Nicola Segata, Michael Shaffer, Arron Shiffer, Rashmi Sinha, Se Jin Song, John R. Spear, Austin D. Swafford, Luke R. Thompson, Pedro J. Torres, Pauline Trinh, Anupriya Tripathi, Peter J. Turnbaugh, Sabah Ul-Hasan, Justin J. J. van der Hooft, Fernando Vargas, Yoshiki Vázquez-Baeza, Emily Vogtmann, Max von Hippel, William Walters, Yunhu Wan, Mingxun Wang, Jonathan Warren, Kyle C. Weber, Charles H. D. Williamson, Amy D. Willis, Zhenjiang Zech Xu, Jesse R. Zaneveld, Yilong Zhang, Qiyun Zhu, Rob Knight & J. Gregory Caporaso#. Reproducible, interactive, scalable and extensible microbiome data science using QIIME 2. ***Nature Biotechnology***. 2019, 37: 852-857. doi:[10.1038/s41587-019-0209-9](https://doi.org/10.1038/s41587-019-0209-9)

## 译者简介

**刘永鑫**，博士。2008年毕业于东北农大微生物学，2014年于中科院遗传发育所获生物信息学博士，2016年博士后出站留所工作，任宏基因组学实验室工程师。目前主要研究方向为宏基因组数据分析和植物微生物组，QIIME 2项目参与人。目前在***Science、Nature Biotechnology***等杂志发表论文十余篇。2017年7月创办“宏基因组”公众号，目前分享宏基因组、扩增子原创文章400余篇，代表博文有[《扩增子图表解读、分析流程和统计绘图三部曲(21篇)》](https://mp.weixin.qq.com/s/u7PQn2ilsgmA6Ayu-oP1tw)、[《Nature综述：手把手教你分析菌群数据(1.8万字)》](https://mp.weixin.qq.com/s/F8Anj9djawaFEUQKkdE1lg)、[《QIIME2中文教程(18篇)》](https://mp.weixin.qq.com/s/IZLjdkRq2-36DJ9X792_MA)等，关注人数6.5万+，累计阅读1000万+。

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