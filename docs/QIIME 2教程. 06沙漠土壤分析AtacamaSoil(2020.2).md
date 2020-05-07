[TOC]
 
# 前情提要

以下是前面几节的微信推送文章：
- [NBT：QIIME 2可重复、交互式的微生物组分析平台](https://mp.weixin.qq.com/s/-_FHxF1XUBNF4qMV1HLPkg)
- [1简介和安装Introduction&Install](https://mp.weixin.qq.com/s/vlc2uIaWnPSMhPBeQtPR4w)
- [2插件工作流程概述Workflow](https://mp.weixin.qq.com/s/qXlx1a8OQN9Ar7HYIC3OqQ)
- [3老司机上路指南Experienced](https://mp.weixin.qq.com/s/gJZCRzenCplCiOsDRHLhjw)
- [4人体各部位微生物组分析Moving Pictures，](https://mp.weixin.qq.com/s/c8ZQegtfNBHZRVjjn5Gyrw) [Genome Biology：人体各部位微生物组时间序列分析](https://mp.weixin.qq.com/s/DhecHNqv4UjYpVEu48oXAw)
- [5粪菌移植分析练习FMT，](https://mp.weixin.qq.com/s/cqzpLOprpClaib1FvH7bjg) [Microbiome：粪菌移植改善自闭症](https://mp.weixin.qq.com/s/PHpg0y6_mydtCXYUwZa2Yg)
- 本篇文章的数据来自于文献《增加干旱对干旱土壤微生物组的显著影响》，点击链接阅读文献解读[mSystems：干旱对土壤微生物组的影响](https://mp.weixin.qq.com/s/j86yqVOaZQYLKf2Ls-N6-w)


# QIIME 2用户文档. 6阿塔卡马沙漠微生物组分析

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.6.00.jpg)

原文地址：https://docs.qiime2.org/2020.2/tutorials/atacama-soils/

**此实例需要一些基础知识，要求完成本系列文章前两篇内容：《[1、简介和安装Introduction&Install](https://mp.weixin.qq.com/s/vlc2uIaWnPSMhPBeQtPR4w)（2020.2版）》和《[4、人体各部位微生物组分析MovingPicture](https://mp.weixin.qq.com/s/c8ZQegtfNBHZRVjjn5Gyrw)（2020.2版）》。**


本教程设计用于两个目的。**首先，它描述了对双端序列分析的初始处理步骤**，直到分析步骤与单端序列分析相同。这包括导入、样本拆分和去噪步骤，并产生特征表和相关的特征序列。**其次，这是一次自我练习**，可以在《[4、人体各部位微生物组分析MovingPicture](https://mp.weixin.qq.com/s/c8ZQegtfNBHZRVjjn5Gyrw)（2020.2版）》之后运行，以获得更多使用QIIME 2的经验。对于这个练习，我们提供了一些可以用来指导分析的问题，但是不提供直接解决每个问题的命令。相反，您应该应用您在《[4、人体各部位微生物组分析MovingPicture](https://mp.weixin.qq.com/s/c8ZQegtfNBHZRVjjn5Gyrw)（2020.2版）》中学到的命令。

在本教程中，您将使用QIIME 2对来自智利北部阿塔卡马沙漠的土壤样本进行分析。阿塔卡马沙漠是地球上最干旱的地方之一，有些地区每**十年降雨量不到一毫米**。尽管极端干旱，土壤中仍然有微生物。本研究采样地点为东部的巴克达诺(Baquedano)和西部的永盖(Yungay)，横断面的平均土壤相对湿度与海拔高度呈正相关（海拔越高，干旱程度越轻，平均土壤相对湿度越高）。沿着这些剖面，在每个地点挖坑，从每个坑的三个深度收集土壤样品。 详见原文解读：[mSystems：干旱对土壤微生物组的影响](https://mp.weixin.qq.com/s/j86yqVOaZQYLKf2Ls-N6-w)。

## 本节视频视频教程

https://v.qq.com/x/page/f0925nkxavm.html

视频有广告，清晰度不够高吗？在微信订阅号“**meta-genome**”后台回复“qiime2”获得1080p视频和测试数据下载链接。


## 启动QIIME2运行环境

对于上文提到了conda/docker两种常用安装方法，我们每次在分析数据前，需要打开工作环境，根据情况选择对应的打开方式。

```
# 定义工作目录变量，方便以后多次使用
wd=~/github/QIIME2ChineseManual/2020.2
mkdir -p $wd
# 进入工作目录，是不是很简介，这样无论你在什么位置就可以快速回到项目文件夹
cd $wd

# 方法1. 进入QIIME 2 conda工作环境
conda activate qiime2-2020.2
# 这时我们的命令行前面出现 (qiime2-2020.2) 表示成功进入工作环境

# 方法2. conda版本较老用户，使用source进入QIIME 2
source activate qiime2-2020.2

# 方法3. 如果是docker安装的请运行如下命令，默认加载当前目录至/data目录
docker run --rm -v $(pwd):/data --name=qiime -it  qiime2/core:2020.2

# 创建本节学习目录
mkdir -p qiime2-atacama-tutorial
cd qiime2-atacama-tutorial
```

## 实验数据下载

**Obtain the data**

注意：**QIIME 2 官方测试数据部分保存在Google服务器上，国内下载比较困难**。可使用代理服务器(如蓝灯)下载，或**公众号后台回复"qiime2"获取测试数据批量下载链接，你还可以跳过以后的wget步骤**。

**下载来源Google文档的实验设计**

```
wget \
  -O "sample-metadata.tsv" \
  "https://data.qiime2.org/2020.2/tutorials/atacama-soils/sample_metadata.tsv"
```

下载双端实验数据(使用10%抽样数据方便下载和演示)：分别为正向、反向和barcodes序列三个文件；文来自亚马逊云，有时无法下载或断开，可不同时间多试几次就成功了。或使用后台百度云链接，或github备份永久链接。

注：github有些文件过大无法上传。建议自行原始地址下载。或后台百度云链接下载(可能会失效)。

```
# mkdir创建序列存放目录
# -p 参数创建目录，即使目录存在也不报错
mkdir -p emp-paired-end-sequences

# wget下载文件
# -c为支持断点续传，跨国下载经常断，-c必须加，否则你下不完断线又要从头下载
wget -c \
  -O "emp-paired-end-sequences/forward.fastq.gz" \
  "https://data.qiime2.org/2020.2/tutorials/atacama-soils/10p/forward.fastq.gz"
wget -c \
  -O "emp-paired-end-sequences/reverse.fastq.gz" \
  "https://data.qiime2.org/2020.2/tutorials/atacama-soils/10p/reverse.fastq.gz"
wget -c \
  -O "emp-paired-end-sequences/barcodes.fastq.gz" \
  "https://data.qiime2.org/2020.2/tutorials/atacama-soils/10p/barcodes.fastq.gz"
```

## 双端数据分析方法

**Paired-end read analysis commands**

双端数据导入，数据建库类型为EMP双端序列`EMPPairedEndSequences`(本示例来自EMP项目)

```
time qiime tools import \
   --type EMPPairedEndSequences \
   --input-path emp-paired-end-sequences \
   --output-path emp-paired-end-sequences.qza
```

导入的压缩文件有320 MB，耗时1m

输出对象:

- `emp-paired-end-sequences.qza`: EMP项目双端测序类型。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fatacama-soils%2Femp-paired-end-sequences.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/atacama-soils/emp-paired-end-sequences.qza)

接下来，我们按Barcode序列信息进行样品拆分。这需要样本元数据文件，您必须指明该文件中的哪个列包含每个样本的条形码。 在这种情况下，该列名称是条形码序列`barcode-sequence`。 在此数据集中，条形码读长是样本元数据文件中包含的条形码读长的反向互补序列，因此我们还包括`--p-rev-comp-mapping-barcodes`参数。 在样品拆分之后，我们可以生成并查看每个样本获得多少序列的摘要。

```
# 样本拆分，EMP双端序列类型，指定元数据，barcode所在列，
# 并序列取反向互补(barcode加有右端时使用)，i为输出文件，o为输出文件和统计
time qiime demux emp-paired \
  --m-barcodes-file sample-metadata.tsv \
  --m-barcodes-column barcode-sequence \
  --p-rev-comp-mapping-barcodes \
  --i-seqs emp-paired-end-sequences.qza \
  --o-per-sample-sequences demux.qza \
  --o-error-correction-details demux-details.qza
# 6m37s

# 摘要可视化为表格
qiime demux summarize \
  --i-data demux.qza \
  --o-visualization demux.qzv
```

输出对象:

- `demux-details.qza`：样品拆分统计文件。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fatacama-soils%2Fdemux-details.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/atacama-soils/demux-details.qza)
- `demux.qza`: 样品拆分结果文件。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fatacama-soils%2Fdemux.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/atacama-soils/demux.qza)

输出可视化:

- `demux.qzv`: 样本拆分结果可视化。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fatacama-soils%2Fdemux.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/atacama-soils/demux.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.6.01.jpg)
图1. 数据量汇总图表。中位数有737，可以分析练手了。

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.6.02.jpg)
图2. 双端数据质量评估图。

网页中交互式图形可以查看每个碱基位置的详细信息。质量分析后，我们根据上图结果和相关表格来确定下步denoise分析参数。


## 去噪并生成特征表和代表序列

在序样本拆分之后，我们将基于十个随机选择的样本来查看序列质量，然后对数据进行去噪。当您查看质量图表时，请注意，与[《4、人体各部位微生物组分析》](https://mp.weixin.qq.com/s/6cLzyJjWQmHm82_U6euJ1g)中的对应图表相比，现在每个示例有两个图表。左边的图表显示正向读取的质量分数，右边的图表显示反向读取的质量分数。我们将使用这些图来确定要使用DADA2进行去噪的裁剪参数，然后使用dada2对双端序列进行去噪。

在这个例子中，我们有150个碱基的正向和反向序列。因为我们需要序列足够长的重叠，以便双端序列可以连接，所以正向和反向序列的前13个基数被修剪，但是没有对序列的末端进行修剪，以避免将读数长度减少太多而无法重叠连接。在这个示例中，对`--p-trim-left-f`和`--p-trim-left-r`以及`--p-trunc-len-f`和`--p-trunc-len-r`提供了相同的值，但这不是必需的。

```
time qiime dada2 denoise-paired \
  --i-demultiplexed-seqs demux.qza \
  --p-trim-left-f 13 \
  --p-trim-left-r 13 \
  --p-trunc-len-f 150 \
  --p-trunc-len-r 150 \
  --o-table table.qza \
  --o-representative-sequences rep-seqs.qza \
  --o-denoising-stats denoising-stats.qza
```

95M数据，用时28m

输出对象:

- `denoising-stats.qza`: 去噪过程统计。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fatacama-soils%2Fdenoising-stats.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/atacama-soils/denoising-stats.qza)
- `rep-seqs.qza:` 代表序列。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fatacama-soils%2Frep-seqs.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/atacama-soils/rep-seqs.qza)
- `table.qza:` 特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fatacama-soils%2Ftable.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/atacama-soils/table.qza)

我们要对获得的表和序列进行统计

```
# 查看Feature表的统计结果
time qiime feature-table summarize \
  --i-table table.qza \
  --o-visualization table.qzv \
  --m-sample-metadata-file sample-metadata.tsv

# 代表序列统计
time qiime feature-table tabulate-seqs \
  --i-data rep-seqs.qza \
  --o-visualization rep-seqs.qzv
```

可视化结果:

- `table.qzv`: 特征表统计表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fatacama-soils%2Ftable.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/atacama-soils/table.qzv)
- `rep-seqs.qzv`: 代表序列统计表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fatacama-soils%2Frep-seqs.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/atacama-soils/rep-seqs.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.6.03.jpg)

**图3. 特征表统计**

我们要根据数据量，来选择合适的重采样值

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.6.04.jpg)

**图4. 代表性序列统计**

长度基本全一致，意义不大。可以点击序列查询相关注意比较方便。

也可以可视化去噪结果：

```
# 去噪过程统计数据可视化
qiime metadata tabulate \
  --m-input-file denoising-stats.qza \
  --o-visualization denoising-stats.qzv
```

输出可视化结果:

- `denoising-stats.qzv`: 去噪过程统计可视化。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fatacama-soils%2Fdenoising-stats.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/atacama-soils/denoising-stats.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.6.05.jpg)

**图5. 去噪过程统计**

可以看各阶段数据剩余的量。双端合并阶段数据是极速下降的。

接下来，分析双端序列和之前的单端序列就一样了。我们可以继续按照《[4、人体各部位微生物组分析Moving Picture](https://mp.weixin.qq.com/s/c8ZQegtfNBHZRVjjn5Gyrw)（2020.2版）》中的命令继续分析啦！

## 接下来分析要回答的科学问题

**Questions to guide data analysis**

通过以下问题，来指导你分析数据。

1. 接下来特征表重采样标准化参数`--p-sampling-depth`应该选多少？基于你重采样的参数，有多少样品应该从实验中剔除？在`core-metrics-phylogenetic`分析中，使用过滤后的样本有多少数据量？
2. 实验设计中的那种分组方式下微生物组成差异最大？采用那种距离计算方法分开更明显，是`unweighted UniFrac`还是`Bray-Curtis`？根据你对这些距离计算方法的理解，这些不同代表什么意义呢？对于连续型的样本属性，考虑尝试使用`qiime metadata distance-matrix`与`qiime diversity mantel`和`qiime diversity bioenv`结合使用更有效，这些命令之前没有提到过，但可以使用`--help`查看详细帮助。
3. 分析样本连续型属性与样本的丰富多、均匀度之间的关系？推荐使用`qiime diversity alpha-correlation`分析多样性与样本属性间的相关性，看看能得到什么结论？不会记得查看帮助文档。
4. 哪种样本的分类与Alpha多样性差异最相关，并比较是否有显著差异？
5. 在门水平查看不同土壤相对温度下微生物组成，哪个门丰度最高？看那些种类与湿度正/负相关？
6. 在有无植被的取样地点，什么菌门差异明显？

## 参考答案

### 重抽样数量的选择

1. 接下来特征表重采样标准化参数`--p-sampling-depth`应该选多少？基于你重采样的参数，有多少样品应该从实验中剔除？在`core-metrics-phylogenetic`分析中，使用过滤后的样本有多少数据量？

想要选择合适的重采样参数，需要使用 https://view.qiime2.org/ 查看 table.qzv 文件，首页即有样本的数据量分布。我们看到有大量样本测序量仅为1000左右。精确选择，要切换至`Interactive Sample Detail面板`，下拉看最下面的每个样本量排序的表格。有大量的1000可以直接去掉，这里可以选1446保留尽可能多的样品；也可选3041，只去掉5个3千以下的样本。此处先选大值，因为分析中可以尽量扔样本，越高质量结果越少越容易发现规律，不够再找。我的也不是标准答案，仅供参数，分析中结果是否最优是尝试出来的。我在此处并没有太多尝试，即有经验，也有个人的习惯。

进化树构建和多样性分析

```
time qiime phylogeny align-to-tree-mafft-fasttree \
  --i-sequences rep-seqs.qza \
  --o-alignment aligned-rep-seqs.qza \
  --o-masked-alignment masked-aligned-rep-seqs.qza \
  --o-tree unrooted-tree.qza \
  --o-rooted-tree rooted-tree.qza
# 1m47s

time qiime diversity core-metrics-phylogenetic \
  --i-phylogeny rooted-tree.qza \
  --i-table table.qza \
  --p-sampling-depth 3041 \
  --m-metadata-file sample-metadata.tsv \
  --output-dir core-metrics-results
# 12s
```

### 环境因子关联分析

2. 实验设计中的那种分组方式下微生物组成差异最大？采用那种距离计算方法分开更明显，是`unweighted UniFrac`还是`Bray-Curtis`？根据你对这些距离计算方法的理解，这些不同代表什么意义呢？对于连续型的样本属性，考虑尝试使用`qiime metadata distance-matrix`与`qiime diversity mantel`和`qiime diversity bioenv`结合使用更有效，这些命令之前没有提到过，但可以使用`--help`查看详细帮助。

我们可以先查看各种距离的 `qzv` 中切换不同的分组方式查看，这里仅选择 bray（bray_curtis_emperor.qzv）和unifrac（weighted_unifrac_emperor.qzv）两种演示。在Color中选择不同分类属性，如ph、humidity等属性，其中`relative-humidity-soil-low`中不同颜色在PCoA的前三轴分开明显。同时要注意每个轴上的解析率。尝试不同的方法，如unifrac中各轴解析率会比bray方法下高很多，是什么原因呢? 可以查查这两种方法的计算原理就清楚了。

接下来我们探索几种可以统计连续型变量的统计方法。`qiime metadata distance-matrix`与`qiime diversity mantel`和`qiime diversity bioenv`

首先学习--help查看`metadata distance-matrix`命令的帮助，看一下新命令的介绍


```
qiime metadata distance-matrix --help

Usage: qiime metadata distance-matrix [OPTIONS]

  Create a distance matrix from a numeric metadata column. The Euclidean
  distance is computed between each pair of samples or features in the
  column.

  Tip: the distance matrix produced by this method can be used as input to
  the Mantel test available in `q2-diversity`.

Parameters:
  --m-metadata-file METADATA
  --m-metadata-column COLUMN  MetadataColumn[Numeric]
                       Numeric metadata column to compute pairwise Euclidean
                       distances from                               [required]
Outputs:
  --o-distance-matrix ARTIFACT
    DistanceMatrix                                                  [required]
Miscellaneous:
  --output-dir PATH    Output unspecified results to a directory
  --verbose / --quiet  Display verbose output to stdout and/or stderr during
                       execution of this action. Or silence output if
                       execution is successful (silence is golden).
  --citations          Show citations and exit.
  --help               Show this message and exit.

```

它是计算元数据/特征中连续数值变量间欧式距离矩阵中命令。输入文件为元数据和列名。输出为qiime2对象qza


```
time qiime metadata distance-matrix \
  --m-metadata-file sample-metadata.tsv \
  --m-metadata-column relative-humidity-soil-low \
  --o-distance-matrix sample-metadata-relative-humidity-soil-low.qza
```

    Plugin error from metadata:
    
      Encountered missing value(s) in the metadata column. Computing a distance matrix from missing values is not supported. IDs with missing values: BAQ4697.1, BAQ4697.2, BAQ4697.3

错误提示：数据中存在错误值，无法计算。一般需要手动在实验设计中移除缺失的样本，再计算。

我们计算一个信息完整的海拔列

```
time qiime metadata distance-matrix \
  --m-metadata-file sample-metadata.tsv \
  --m-metadata-column elevation \
  --o-distance-matrix sample-metadata-elevation.qza
```


`qiime diversity mantel`可以基于特征的距离矩阵，和样本元数据的距离矩阵，计算两者间的相关性。找到和微生物群落结构变化的相关因素。

```
time qiime diversity mantel \
  --i-dm1 core-metrics-results/weighted_unifrac_distance_matrix.qza \
  --i-dm2 sample-metadata-elevation.qza \
  --p-method spearman \
  --p-intersect-ids True \
  --p-label1 weighted_unifrac \
  --p-label2 elevation \
  --o-visualization core-metrics-results/weighted_unifrac_evaluation.qzv
```

我们看到 海拔 与 unifrac间存在显著相关。


`qiime diversity bioenv`计算元数据的欧式距离中那一类与距离矩阵秩最大相关。其中所有的数字列都会考虑，缺失值会自动移除，输出可视化结果。

```
# 原始数据中列太多，也存在错误；只提取其中部分
cut -f 1-5,10,13 sample-metadata.tsv > temp
# 计算数字列的相关性
time qiime diversity bioenv \
  --i-distance-matrix core-metrics-results/weighted_unifrac_distance_matrix.qza \
  --m-metadata-file temp \
  --o-visualization core-metrics-results/weighted-unifrac-bioenv.qzv
```

average-soil-relative-humidity是最大相关因素。

### alpha多样性与连续性变量分析

3. 分析样本连续型属性与样本的丰富多、均匀度之间的关系？推荐使用`qiime diversity alpha-correlation`分析多样性与样本属性间的相关性，看看能得到什么结论？不会记得查看帮助文档。

我们以observed_otus(richness)为例

```
# 查看帮助
qiime diversity alpha-correlation --help

time qiime diversity alpha-correlation \
  --i-alpha-diversity core-metrics-results/observed_otus_vector.qza \
  --m-metadata-file sample-metadata.tsv \
  --o-visualization  core-metrics-results/observed_otus_correlation.qzv
```

看到elevation与richness显著相关，再Column切换其它参数，如`average-soil-relative-humidity`相关性更好，高达0.6909。

4. 哪种样本的分类与Alpha多样性差异最相关，并比较是否有显著差异？

同上一题。查看`core-metrics-results/observed_otus_correlation.qzv`结果即有答案。

### 物种组成差异及相关分析

5. 在门水平查看不同土壤相对温度下微生物组成，哪个门丰度最高？看那些种类与湿度正/负相关？

想分析门水平，必须先物种注释，再统计组成。

```
# 物种注释和可视化，使用上一节下载的数据库，2min
time qiime feature-classifier classify-sklearn \
  --i-classifier ../qiime2-moving-pictures-tutorial/gg-13-8-99-515-806-nb-classifier.qza \
  --i-reads rep-seqs.qza \
  --o-classification taxonomy.qza
# 2min10s

# 生成物种可视化，即每个Feature对应的物种注释和可信度
time qiime metadata tabulate \
  --m-input-file taxonomy.qza \
  --o-visualization taxonomy.qzv

# 物种组成柱状图，按Level2和样本类型 sample-type 排序
time qiime taxa barplot \
  --i-table table.qza \
  --i-taxonomy taxonomy.qza \
  --m-metadata-file sample-metadata.tsv \
  --o-visualization taxa-bar-plots.qzv
```

查看`taxa-bar-plots.qzv`，按`Taxonomic Level`选择Level 2，Sort按`average-soil-temperature`，可以查看放线菌丰度最高。相关性分析如何呢？大家想一想。

6. 在有无植被的取样地点，什么菌门差异明显？


```
# 按属比较，需要先合并
time qiime taxa collapse \
  --i-table table.qza \
  --i-taxonomy taxonomy.qza \
  --p-level 2 \
  --o-collapsed-table table-l2.qza

# 格式转换
time qiime composition add-pseudocount \
  --i-table table-l2.qza \
  --o-composition-table comp-table-l2.qza

# 按有无植被差异比较
time qiime composition ancom \
  --i-table comp-table-l2.qza \
  --m-metadata-file sample-metadata.tsv \
  --m-metadata-column vegetation \
  --o-visualization l6-ancom-vegetation.qzv  
# 分类学差异直接有名称，不用feature再对应物种注释
```


## Reference

https://docs.qiime2.org/2020.2/

Evan Bolyen*, Jai Ram Rideout*, Matthew R. Dillon*, Nicholas A. Bokulich*, Christian C. Abnet, Gabriel A. Al-Ghalith, Harriet Alexander, Eric J. Alm, Manimozhiyan Arumugam, Francesco Asnicar, Yang Bai, Jordan E. Bisanz, Kyle Bittinger, Asker Brejnrod, Colin J. Brislawn, C. Titus Brown, Benjamin J. Callahan, Andrés Mauricio Caraballo-Rodríguez, John Chase, Emily K. Cope, Ricardo Da Silva, Christian Diener, Pieter C. Dorrestein, Gavin M. Douglas, Daniel M. Durall, Claire Duvallet, Christian F. Edwardson, Madeleine Ernst, Mehrbod Estaki, Jennifer Fouquier, Julia M. Gauglitz, Sean M. Gibbons, Deanna L. Gibson, Antonio Gonzalez, Kestrel Gorlick, Jiarong Guo, Benjamin Hillmann, Susan Holmes, Hannes Holste, Curtis Huttenhower, Gavin A. Huttley, Stefan Janssen, Alan K. Jarmusch, Lingjing Jiang, Benjamin D. Kaehler, Kyo Bin Kang, Christopher R. Keefe, Paul Keim, Scott T. Kelley, Dan Knights, Irina Koester, Tomasz Kosciolek, Jorden Kreps, Morgan G. I. Langille, Joslynn Lee, Ruth Ley, **Yong-Xin Liu**, Erikka Loftfield, Catherine Lozupone, Massoud Maher, Clarisse Marotz, Bryan D. Martin, Daniel McDonald, Lauren J. McIver, Alexey V. Melnik, Jessica L. Metcalf, Sydney C. Morgan, Jamie T. Morton, Ahmad Turan Naimey, Jose A. Navas-Molina, Louis Felix Nothias, Stephanie B. Orchanian, Talima Pearson, Samuel L. Peoples, Daniel Petras, Mary Lai Preuss, Elmar Pruesse, Lasse Buur Rasmussen, Adam Rivers, Michael S. Robeson, Patrick Rosenthal, Nicola Segata, Michael Shaffer, Arron Shiffer, Rashmi Sinha, Se Jin Song, John R. Spear, Austin D. Swafford, Luke R. Thompson, Pedro J. Torres, Pauline Trinh, Anupriya Tripathi, Peter J. Turnbaugh, Sabah Ul-Hasan, Justin J. J. van der Hooft, Fernando Vargas, Yoshiki Vázquez-Baeza, Emily Vogtmann, Max von Hippel, William Walters, Yunhu Wan, Mingxun Wang, Jonathan Warren, Kyle C. Weber, Charles H. D. Williamson, Amy D. Willis, Zhenjiang Zech Xu, Jesse R. Zaneveld, Yilong Zhang, Qiyun Zhu, Rob Knight & J. Gregory Caporaso#. Reproducible, interactive, scalable and extensible microbiome data science using QIIME 2. ***Nature Biotechnology***. 2019, 37: 852-857. doi:[10.1038/s41587-019-0209-9](https://doi.org/10.1038/s41587-019-0209-9)

The data used in this tutorial is presented in: Significant Impacts of Increasing Aridity on the Arid Soil Microbiome. Julia W. Neilson, Katy Califf, Cesar Cardona, Audrey Copeland, Will van Treuren, Karen L. Josephson, Rob Knight, Jack A. Gilbert, Jay Quade, J. Gregory Caporaso, and Raina M. Maier. mSystems May 2017, 2 (3) e00195-16; DOI: 10.1128/mSystems.00195-16.


## 译者简介

**刘永鑫**，博士。2008年毕业于东北农大微生物学，2014年于中科院遗传发育所获生物信息学博士，2016年遗传学博士后出站留所工作，任宏基因组学实验室工程师。目前主要研究方向为宏基因组数据分析和植物微生物组，QIIME 2项目参与人。目前在***Science、Nature Biotechnology、Cell Host & Microbe、Current Opinion in Microbiology*** 等杂志发表论文20+篇。2017年7月创办“宏基因组”公众号，目前分享宏基因组、扩增子原创文章500余篇，代表博文有[《扩增子图表解读、分析流程和统计绘图三部曲(21篇)》](https://mp.weixin.qq.com/s/u7PQn2ilsgmA6Ayu-oP1tw)、[《Nature综述：手把手教你分析菌群数据(1.8万字)》](https://mp.weixin.qq.com/s/F8Anj9djawaFEUQKkdE1lg)、[《QIIME2中文教程(22篇)》](https://mp.weixin.qq.com/s/UFLNaJtFPH-eyd1bLRiPTQ)等，关注人数8万+，累计阅读1200万+。

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