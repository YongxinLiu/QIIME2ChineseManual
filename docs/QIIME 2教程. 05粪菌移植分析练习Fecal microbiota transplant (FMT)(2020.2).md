[TOC]

# 前情提要

以下是前面几节的微信推送文章：

- [NBT：QIIME 2可重复、交互式的微生物组分析平台](https://mp.weixin.qq.com/s/-_FHxF1XUBNF4qMV1HLPkg)
- [1简介和安装Introduction&Install](https://mp.weixin.qq.com/s/vlc2uIaWnPSMhPBeQtPR4w)
- [2插件工作流程概述Workflow](https://mp.weixin.qq.com/s/qXlx1a8OQN9Ar7HYIC3OqQ)
- [3老司机上路指南Experienced](https://mp.weixin.qq.com/s/gJZCRzenCplCiOsDRHLhjw)
- [4人体各部位微生物组分析Moving Pictures](https://mp.weixin.qq.com/s/c8ZQegtfNBHZRVjjn5Gyrw) 

# QIIME 2用户文档. 5粪菌移植分析练习

**Fecal microbiota transplant (FMT) study: an exercise**

https://docs.qiime2.org/2020.2/tutorials/fmt/

> 注意：本教程假定您已经完成[1简介和安装Introduction&Install](https://mp.weixin.qq.com/s/vlc2uIaWnPSMhPBeQtPR4w)，成功安装QIIME 2。

本教程计划在完成《[4人体各部位微生物组分析MovingPicture](https://mp.weixin.qq.com/s/c8ZQegtfNBHZRVjjn5Gyrw)》之后练习。它旨在介绍一些新思想，并且是应用该文档中探索工具的一个练习。

本教程中使用的数据来自[2017年发表于Microbiome上关于粪便微生物移植（粪菌移植）改善自闭症的研究(Microbiota Transfer Therapy alters gut ecosystem and improves gastrointestinal and autism symptoms: an open-label study)](http://doi.org/10.1186/s40168-016-0225-7)，详见《[Microbiome：粪菌移植改善自闭症](https://mp.weixin.qq.com/s/VXy9haFsnnMVlyXLULy52w)》。其中18岁以下患有自闭症和胃肠道疾病的儿童，分别通过自闭症诊断访谈修订版(ADI-R)和胃肠道症状评定量表(GSRS)测量，用粪便微生物移植治疗，试图减少他们的行为异常和胃肠道症状的严重程度。我们通过18周内他们的GSRS评分追踪了他们的微生物变化，包括父母的整体状况III（Parent Global Impressions，PGI-III）和儿童孤独症评定量表（CARS），以及他们胃肠道症状的严重程度。通过每周收集粪便拭子样本（用擦拭用过的卫生纸收集）和不太频繁的大便样本（收集全大便）来跟踪微生物群。在全部研究中，这是第一阶段的临床试验，旨在测试治疗的安全性，18个人接受了治疗，20个人作为对照。对照组未接受治疗，但监测肠道微生物群的正常时间变化。本研究还对治疗期间移植的粪便材料进行了测序。

本教程数据集是为本研究数据的一个子集。它包括五个接受治疗的个体和五个对照的数据。每个个体包括6至16个样本，包括每个个体的大便和粪便拭子样本，以及FMT治疗前后样本。移植的粪便材料也包括五个样本。

这些数据是在两次Illumina MiSeq测序批次（Run）中测序。如《人体各部位微生物组教程》所示，我们将使用[DADA2](https://www.ncbi.nlm.nih.gov/pubmed/27214047)执行初始质量控制并生成`FeatureTable[Frequency]`和`FeatureData[Sequence]`对象。然而，**DADA2去噪过程只适用于一次单个测序批次，因此我们需要在每个测序批次的基础上运行该过程，然后合并结果**。我们将完成这个初始步骤，然后提出一些可以作为练习来回答的问题。

> 详者注：此实例需要一些基础知识，要求完成学习本系列文章前两篇内容：[《1简介和安装Introduction&Install》](https://mp.weixin.qq.com/s/vlc2uIaWnPSMhPBeQtPR4w)和[《4人体各部位微生物组分析Moving Picture》](https://mp.weixin.qq.com/s/c8ZQegtfNBHZRVjjn5Gyrw)。


## 本节视频视频教程

https://v.qq.com/x/page/a0920py9hwl.html

视频有广告，清晰度不够高吗？在微信订阅号“**meta-genome**”后台回复“qiime2”获得1080p视频和测试数据下载链接。

## 实验设计简介

![image](http://bailab.genetics.ac.cn/markdown/note/FMT1.jpg)

本实验研究自闭症且胃肠道功能紊乱患者，采用粪便菌群移植方法，来降低患者的行为异常和肠道紊乱。监测移植后18个月范围内肠道菌群的变化，上图为[Microbiome原文中实验设计](http://doi.org/10.1186/s40168-016-0225-7)。  

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
mkdir -p qiime2-fmt-tutorial
cd qiime2-fmt-tutorial
```


## 实验数据下载

**Obtain data files**

注意：**QIIME 2 官方测试数据均保存在Google服务器上，国内下载比较困难**。可使用代理服务器(如蓝灯、谷歌上网助手帮助)下载此链接 https://data.qiime2.org/2020.2/tutorials/fmt/sample_metadata.tsv ，国内用户可选在**QIIME 2中文Github页面 https://github.com/YongxinLiu/QIIME2ChineseManual  、或公众号后台回复"qiime2"等方式获取测试数据下载链接，提供多种备选方式保证数据可用**。

下载元数据，即描述样本的数据，也称实验设计。通过上述方法下载请跳过。

```
wget \
  -O "sample-metadata.tsv" \
  "https://data.qiime2.org/2020.2/tutorials/fmt/sample_metadata.tsv"
```

接下来，下载我们将在本分析中使用的拆分好的混合样本序列。要了解如何从fastq格式的序列数据中开始QIIME 2分析，请参阅[导入数据教程](https://docs.qiime2.org/2020.2/tutorials/importing/)。我们需要下载两组样本拆分好的序列，每个序列文件对应一个序列测序批次。

在本教程中，我们将使用完整序列数据的一个小子集，以便命令能够快速运行。您可以选择1%的序列子集或10%的序列子集。如果您只是试图获得准备和组合多个数据序列运行的经验，那么您可以使用1%的子集数据，以便命令可以非常快速地运行。如果您使用本教程来获得在生成和解释QIIME 2分析结果方面的额外经验，那么您应该使用10%的子采样数据，以便结果将由更多的序列数据支持（1%的序列可能不足以支持原始研究的一些发现）。

**这里我们选择10%的子集序列用于后序列分析。**

因为10%的子集序列也非常少，才几十M，注意文件名要手动删除`-10p`部分。

```
# 20M，about 30s
wget \
  -O "fmt-tutorial-demux-1.qza" \
  "https://data.qiime2.org/2020.2/tutorials/fmt/fmt-tutorial-demux-1-10p.qza"
wget \
  -O "fmt-tutorial-demux-2.qza" \
  "https://data.qiime2.org/2020.2/tutorials/fmt/fmt-tutorial-demux-2-10p.qza"
```

## 序列质控评估

**Sequence quality control**

上节我们使用[DADA2](https://www.ncbi.nlm.nih.gov/pubmed/27214047)对样本拆分后的序列执行质量控制，但是这次我们将对每组样本拆分后序列分别运行`denoise-single`(单端去噪)命令。同样，我们希望可视化每批次中样本的序列质量。当我们运行`denoise-single`命令时，我们需要为两次分析`--p-trunc-len`和`--p-trim-left`使用相同的参数值。当查看这两个命令产生的可视化时，只有两个命令基于相同的参数分析结果进行比较才有意义，否则多变量因素导致混淆。

**样本拆分结果的统计**

```
qiime demux summarize \
  --i-data fmt-tutorial-demux-1.qza \
  --o-visualization demux-summary-1.qzv
qiime demux summarize \
  --i-data fmt-tutorial-demux-2.qza \
  --o-visualization demux-summary-2.qzv
```

输出对象:

- `fmt-tutorial-demux-1.qza`: 第一批测序结果。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffmt%2Ffmt-tutorial-demux-1.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/fmt/fmt-tutorial-demux-1.qza)
- `fmt-tutorial-demux-2.qza`: 第二批测序结果。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffmt%2Ffmt-tutorial-demux-2.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/fmt/fmt-tutorial-demux-2.qza)

输出可视化:

- `demux-summary-1.qzv`: 第二批样本数据量和质量统计。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffmt%2Fdemux-summary-1.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/fmt/demux-summary-1.qzv)
- `demux-summary-2.qzv`: 第一批样本数据量和质量统计。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffmt%2Fdemux-summary-2.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/fmt/demux-summary-2.qzv)


查看可视化评估结果，也可下载qzv文件，使用 view.qiime2.org 打开查看，也可解压查看。

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.5.01.jpg)
**图1. 第一批数据量汇总图表**

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.5.02.jpg)
**图2. 第一批数据质量评估图**

> 问题：我们在两批结果中的交互质量图中观察，综合选择质控参数`--p-trunc-len` 和`--p-trim-left`的值是多少比较合理？  

> 详者注：序列上游13 bp的序列质量偏低，设置trim-left 13截掉前13bp序列；整体到150bp的质量都不错，则trunc-len保留150 bp的序列长度。

## 生成特征表和代表性序列

前几个碱基的质量似乎相对较低，然后似乎保持相对较高，直到序列测序结束。因此，我们将从每个序列中修剪前13个碱基，并在150个碱基处截断这些碱基。由于读数是151个碱基，这导致序列的截断非常少。

dada2质控和去冗余，本实验有两批独立的数据，需要处理两次，生成代表序列和特征表

```
# 去噪生成特征表，4m40.475s
time qiime dada2 denoise-single \
  --p-trim-left 13 \
  --p-trunc-len 150 \
  --i-demultiplexed-seqs fmt-tutorial-demux-1.qza \
  --o-representative-sequences rep-seqs-1.qza \
  --o-table table-1.qza \
  --o-denoising-stats stats-1.qza

# 去噪生成特征表，2m1.706s
time qiime dada2 denoise-single \
  --p-trim-left 13 \
  --p-trunc-len 150 \
  --i-demultiplexed-seqs fmt-tutorial-demux-2.qza \
  --o-representative-sequences rep-seqs-2.qza \
  --o-table table-2.qza \
  --o-denoising-stats stats-2.qza
```

输出对象:

- `stats-1.qza`: 第一批数据统计结果。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffmt%2Fstats-1.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/fmt/stats-1.qza)
- `stats-2.qza`: 第二批数据统计结果。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffmt%2Fstats-2.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/fmt/stats-2.qza)
- `rep-seqs-1.qza`: 第一批数据代表性序列。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffmt%2Frep-seqs-1.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/fmt/rep-seqs-1.qza)
- `rep-seqs-2.qza`: 第二批数据代表性序列。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffmt%2Frep-seqs-2.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/fmt/rep-seqs-2.qza)
- `table-1.qza`: 第一批数据特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffmt%2Ftable-1.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/fmt/table-1.qza)
- `table-2.qza`: 第二批数据特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffmt%2Ftable-2.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/fmt/table-2.qza)

## 查看去噪过程统计

**Viewing denoising stats**

`denoise-single`命令返回去噪过程的基本统计，可以使用如下命令可视化。

```
qiime metadata tabulate \
  --m-input-file stats-1.qza \
  --o-visualization denoising-stats-1.qzv
qiime metadata tabulate \
  --m-input-file stats-2.qza \
  --o-visualization denoising-stats-2.qzv
```

结果可视化文件:

- denoising-stats-1.qzv: 批次1可视化。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffmt%2Fdenoising-stats-1.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/fmt/denoising-stats-1.qzv)
- denoising-stats-2.qzv: 批次2可视化。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffmt%2Fdenoising-stats-2.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/fmt/denoising-stats-2.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.5.03.jpg)

图3. 第一批数据质量去噪过程统计。有非常多列，可托动下方滚动条查看；样本多，可以在右上角Search中查找。

## 合并不同批的代表序列和特征表

**Merging denoised data**

在这个分析中，`denoise-single`命令是最后一步，它需要对每批数据独立处理。因此，我们必须合并由这两个命令生成的对象，才能继续下游分析。首先我们将合并两个`FeatureTable[Frequency]`对象，然后合并两个`FeatureData[Sequence]`对象。这种操作是可行的，因为在每次去噪`denoise-single`单次运行中生成的特征id是可以直接比较的（在这种情况下，特征id是定义特征序列的md5值(散列/哈希))。

**合并两组数据特征表**

```
time qiime feature-table merge \
  --i-tables table-1.qza \
  --i-tables table-2.qza \
  --o-merged-table table.qza
```

当然也可以继续增加更多的批次数据，只要使用更多次的`--i-tables`参数即可
  
**合并两组数据的代表序列**

```
time qiime feature-table merge-seqs \
  --i-data rep-seqs-1.qza \
  --i-data rep-seqs-2.qza \
  --o-merged-data rep-seqs.qza
```

输出对象:

- `rep-seqs.qza`: 合并的代表序列。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffmt%2Frep-seqs.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/fmt/rep-seqs.qza)
- `table.qza`: 合并的特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffmt%2Ftable.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/fmt/table.qza)

特征表数据需要进行**特征表统计**，查看基本情况。

```
time qiime feature-table summarize \
  --i-table table.qza \
  --o-visualization table.qzv \
  --m-sample-metadata-file sample-metadata.tsv
```

**输出可视化结果：**

- `table.qzv`：特征表统计结果。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffmt%2Ftable.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/fmt/table.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.5.04.jpg)

图4. 特征表汇总。下面还包括样本信息的汇总图表、特征的汇总图表。此页面中还可以交互查看样本、特征的详细信息，自己在网页或本地中查看和探索结果吧！

图片看不清，可查看下方纯文本表格

### 表1. 特征表总结

Metric|	Sample
---|---
Number of samples|	121
Number of features|	337
Total frequency|	48,925

### 表2. 样品数据量分布

Type |Frequency
---|---
Minimum frequency|	84.0
1st quartile|	276.0
Median frequency|	380.0
3rd quartile|	492.0
Maximum frequency|	860.0
Mean frequency|	404.3388429752066

### 表3. 特征表频率统计

Type |Frequency
---|---
Minimum frequency|	2.0
1st quartile|	9.0
Median frequency|	24.0
3rd quartile|	85.0
Maximum frequency|	10,832.0
Mean frequency|	145.1780415430267

> 详者注：通过上表，我们可以确定特征表标准化时数据重抽样的参数，由于本测试，只用了文章原始数据的10%的数据，数据量很小，最小值为84，第一分位数为276，我们可选择276保留75%以上的样品。一般最小值1000，推荐5000以上，如果数据量都很大3-5万更好。

> 问题1. 基于`table.qzv`中的信息，在运行`qiime diversity core-metrics-phylogenetic`时，您将为`--p-sampling-depth`参数选择什么值？

> 问题2. 生成`qiime dada2 denoise-single`单批次数据结果汇总表中，查看第一批数据中定义了多少特性？在第二批数据中定义了多少特性？这些数字与合并后的特性总数相比如何？

我们还将生成合并后的`FeatureData[Sequence]`对象的摘要。在进行分析时，可以使用此摘要获得感兴趣特性的额外信息。

**代表序列统计**

```
qiime feature-table tabulate-seqs \
  --i-data rep-seqs.qza \
  --o-visualization rep-seqs.qzv
```

输出可视化结果:

- `rep-seqs.qzv`：合并的代表性序列统计结果。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Ffmt%2Frep-seqs.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/fmt/rep-seqs.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.5.05.jpg)

**图5. 特征序列长度统计。**
基本统计、分位数和序列详细。可点击序列进行NCBI blast查看详细注释。

## 多样性分析

**Diversity analysis**

现在我们已经获得了特征表(Feature table)`FeatureTable[Frequency]`，以及代表序列(Feature Sequences)`FeatureData[Sequence]`对象，你可以基于样本元数据来探索其微生物组成。自己尝试用上篇文章《[4人体各部位微生物组分析MovingPicture](https://mp.weixin.qq.com/s/c8ZQegtfNBHZRVjjn5Gyrw)》（2020.2版）分析方法。几个问题与个体的微生物组的纵向变化有关；可以参考[`q2-longitudinal`教程](https://docs.qiime2.org/2020.2/tutorials/longitudinal/)，后面的教程中会详细讲解，到时可以学习此类分析方法。试着回答以下问题？

1. 个体微生物组；
    1. 按个体(subject-id)分类是否存在组成差异？
    2. 按个体分类存在丰富度差异吗？
    3. 按个体分类存在均匀度差异吗？
    4. 在起始和研究终点间，个体的丰富度、均匀度、组成和UniFrac距离发生改变了吗？(尝试[`q2-longitudinal tutorial`](https://docs.qiime2.org/2019.7/tutorials/longitudinal/)中的成对差异/距离方法)
    5. 丰富度、均匀度、物种组成、UniFrac距离与是否粪菌移植FMT或其它个体元数据有什么关系？处理组和对照组随时间变化大吗？（提示：有关时间序列分析，即使现在不懂也没关系，后面的章节会详细介绍，学完后再回来回答这些问题）
2. 菌群移植；
    1. 移植几周后，患者的菌群在unweighted unifrac距离下最像供体呢(使用`qiime emperor plot`)？
    2. 移植几周后，患者的菌群在Bray-Curtis距离下最像供体；
    3. 比较两种距离结果那种更好解释；
3. 实验设计：比较粪便和试子样品采集方法；
    1. 比较不同取样方法结果中最大差别的特征？差异特征用blast，或机器学习classifier注释有什么不同？
    2. 两类样品的unweighted Unifrac和Bray-Curtis间有什么不同？
    3. 供体粪便与那种取样的结果更像？
    4. 两类取样方法的Alpha多样性存在差别吗？
4. 每个测序批次中有多少样品？在不同测序批次中是否存在系统性差异？

你已经获得了特征表、代表序列，还有你的实验设计。只需要《[4人体各部位微生物组分析MovingPicture](https://mp.weixin.qq.com/s/c8ZQegtfNBHZRVjjn5Gyrw)》（2020.2版）中`构建进化树用于多样性分析`开始往后的代码运行一遍，再交互式探索结果，上面的问题的答案不言自明。


## 参考答案代码

### 1.1 按个体(subject-id)分类是否存在组成差异？

我们要考虑个体间是否存在差异，一般从整体描述角度，多查看Beta多样性分析结果，当然也可以查看Alpha或Taxonomy的差异。这里以最常用的Bray-Curtis距离下的Beta多样性为例来回答此问题。

**进化树和多样性计算**

```
# 构建进化树用于多样性分析
time qiime phylogeny align-to-tree-mafft-fasttree \
  --i-sequences rep-seqs.qza \
  --o-alignment aligned-rep-seqs.qza \
  --o-masked-alignment masked-aligned-rep-seqs.qza \
  --o-tree unrooted-tree.qza \
  --o-rooted-tree rooted-tree.qza

# Alpha和beta多样性分析，选择合适的抽样数量，观察table.qzv，仅有一个样小于1150
time qiime diversity core-metrics-phylogenetic \
  --i-phylogeny rooted-tree.qza \
  --i-table table.qza \
  --p-sampling-depth 1150 \
  --m-metadata-file sample-metadata.tsv \
  --output-dir core-metrics-results
```

我们用 https://view.qiime2.org 查看结果 `core-metrics-results/bray_curtis_emperor.qzv`，着色Color选择`subject-id`，图中可以看到不同颜色有明显分开的趋势，初步判断可能存在个体间组成差异，但还要结合统计。


### 1.2/3 按个体分类存在丰富/均匀度差异吗？

要回答这两个问题，我们将采用`diversity alpha-group-significance`统计`subject-id`组间丰富度(observed_otus/richness)和均匀度(evenness)的差异显著情况。默认计算sample-metadata.tsv中的全部分组情况。

**Alpha多样性`subject`组间显著性分析和可视化**

```
qiime diversity alpha-group-significance \
  --i-alpha-diversity core-metrics-results/observed_otus_vector.qza \
  --m-metadata-file sample-metadata.tsv \
  --o-visualization core-metrics-results/observed_otus-group-significance.qzv

qiime diversity alpha-group-significance \
  --i-alpha-diversity core-metrics-results/evenness_vector.qza \
  --m-metadata-file sample-metadata.tsv \
  --o-visualization core-metrics-results/evenness-group-significance.qzv
```

使用QIIME2view打开`observed_otus-group-significance.qzv`，Column切换为subject-id可以查看个体间丰富多的比对箱线图，具体是否显著，可查看下面的表格。

从整体上看，P值不显著(p-value=0.55, Kruskal-Wallis test)。具体两两比较存在一些个体显著差异(p-value < 0.05, Kruskal-Wallis test)，如查看P值在B107 (n=12)	和B159 (n=7)	组间存在显著(p = 0.031077)。但由于存在特别多组的比较，多重比较校正的q-value不显著(q-value > 0.05)

此外，此图还可以查看更多分类型分组间是否存在多样性的差别。均匀度查看`evenness-group-significance.qzv`文件即可，同理，我们发现按`subject-id`分组没有q-value < 0.05的组，但有两组存在 q-value = 0.06，在没有更好的实验候选下也值得关注。

### 1.4/5 时间序列上的统计

我们在学完后面的教程再补充答案，有基础的同行，可根据后面的章节参考代码自行尝试。

### 2. 菌群移植在时间上的Beta多样性

2. 菌群移植；
    1. 移植几周后，患者的菌群在unweighted unifrac距离下最像供体呢(使用`qiime emperor plot`)？
    2. 移植几周后，患者的菌群在Bray-Curtis距离下最像供体；
    3. 比较两种距离结果那种更好解释；

主要分析unweighted_unifrac和bray_curtis距离在主轴和时间变量上的变化

```
qiime emperor plot \
  --i-pcoa core-metrics-results/unweighted_unifrac_pcoa_results.qza \
  --m-metadata-file sample-metadata.tsv \
  --p-custom-axes week \
  --o-visualization core-metrics-results/unweighted-unifrac-emperor-week.qzv

qiime emperor plot \
  --i-pcoa core-metrics-results/bray_curtis_pcoa_results.qza \
  --m-metadata-file sample-metadata.tsv \
  --p-custom-axes week \
  --o-visualization core-metrics-results/bray-curtis-emperor-week.qzv
```

我们以unweighted_unifrac距离为例，查看`core-metrics-results/unweighted-unifrac-emperor-week.qzv`结果，把Color分组着色选为`week`，看到样本在week轴上展开非常好。再切换Sahpe面板，修改`treatment-group`的形状为diamond，这样可以按不同形状分清供体和受试者。看到蓝色0周时与供体更像吗？同理，可查看bray_curtis距离的结果，规律如何呢？一般个人觉得Bray-Curtis距离有更好的解释，而且有权重比无权重更可信，更有意义。在不同场景下可能有不同的解读。

还可以进一步评估样本的测序量是否饱和，或从稀疏曲线中观察各组、时间点间的变化规律

```
# Alpha稀疏曲线
time qiime diversity alpha-rarefaction \
  --i-table table.qza \
  --i-phylogeny rooted-tree.qza \
  --p-max-depth 5000 \
  --m-metadata-file sample-metadata.tsv \
  --o-visualization alpha-rarefaction.qzv
```

### 3. 实验设计：比较粪便和试子样品采集方法；


3. 实验设计：比较粪便和试子样品采集方法；
    1. 比较不同取样方法结果中最大差别的特征？差异特征用blast，或机器学习classifier注释有什么不同？（按采集方法分组计算差异ASV）
    2. 两类样品的unweighted Unifrac和Bray-Curtis间有什么不同？
    3. 供体粪便与那种取样的结果更像？
    4. 两类取样方法的Alpha多样性存在差别吗？

物种注释，用于知道差异特征的物种信息

**物种注释和组间比较**

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

最大差异特征，即为组间差异结果中最明显的，或丰度最大的。

差异比较计算量大，每次只能指定一类进行统计计算，如比较批次，需要指定 `sequencing-run`列，如比较粪便和试子样品采集方法，则指定列名为`sample-type`。这里以sample-type为例进行计算，更多分组方法，请读者自行探索。

```
# 格式转换
time qiime composition add-pseudocount \
  --i-table table.qza \
  --o-composition-table comp-table.qza

# 按样本类型比较ASV
time qiime composition ancom \
  --i-table comp-table.qza \
  --m-metadata-file sample-metadata.tsv \
  --m-metadata-column sample-type \
  --o-visualization ancom-sample-type.qzv
# 3m38s，结果中的差异feautre，在`taxonomy.qzv`中查询注释。

# 按属比较，需要先合并
time qiime taxa collapse \
  --i-table table.qza \
  --i-taxonomy taxonomy.qza \
  --p-level 6 \
  --o-collapsed-table table-l6.qza

# 格式转换
time qiime composition add-pseudocount \
  --i-table table-l6.qza \
  --o-composition-table comp-table-l6.qza

# 差异比较
time qiime composition ancom \
  --i-table comp-table-l6.qza \
  --m-metadata-file sample-metadata.tsv \
  --m-metadata-column sample-type \
  --o-visualization l6-ancom-sample-type.qzv  
# 分类学差异直接有名称，不用feature再对应物种注释
```

### 4. 每个测序批次中有多少样品？在不同测序批次中是否存在系统性差异？

同理，按`sequencing-run`为分组，分别观察alpha, beta, taxonomy的差异即可。重用上面的代码，只是更换分组。

## 译者简介

**刘永鑫**，博士。2008年毕业于东北农大微生物学，2014年于中科院遗传发育所获生物信息学博士，2016年遗传学博士后出站留所工作，任宏基因组学实验室工程师。目前主要研究方向为宏基因组数据分析和植物微生物组，QIIME 2项目参与人。目前在***Science、Nature Biotechnology、Cell Host & Microbe、Current Opinion in Microbiology*** 等杂志发表论文20+篇。2017年7月创办“宏基因组”公众号，目前分享宏基因组、扩增子原创文章500余篇，代表博文有[《扩增子图表解读、分析流程和统计绘图三部曲(21篇)》](https://mp.weixin.qq.com/s/u7PQn2ilsgmA6Ayu-oP1tw)、[《Nature综述：手把手教你分析菌群数据(1.8万字)》](https://mp.weixin.qq.com/s/F8Anj9djawaFEUQKkdE1lg)、[《QIIME2中文教程(22篇)》](https://mp.weixin.qq.com/s/UFLNaJtFPH-eyd1bLRiPTQ)等，关注人数8万+，累计阅读1200万+。


## Reference

https://docs.qiime2.org/2020.2/

Evan Bolyen*, Jai Ram Rideout*, Matthew R. Dillon*, Nicholas A. Bokulich*, Christian C. Abnet, Gabriel A. Al-Ghalith, Harriet Alexander, Eric J. Alm, Manimozhiyan Arumugam, Francesco Asnicar, Yang Bai, Jordan E. Bisanz, Kyle Bittinger, Asker Brejnrod, Colin J. Brislawn, C. Titus Brown, Benjamin J. Callahan, Andrés Mauricio Caraballo-Rodríguez, John Chase, Emily K. Cope, Ricardo Da Silva, Christian Diener, Pieter C. Dorrestein, Gavin M. Douglas, Daniel M. Durall, Claire Duvallet, Christian F. Edwardson, Madeleine Ernst, Mehrbod Estaki, Jennifer Fouquier, Julia M. Gauglitz, Sean M. Gibbons, Deanna L. Gibson, Antonio Gonzalez, Kestrel Gorlick, Jiarong Guo, Benjamin Hillmann, Susan Holmes, Hannes Holste, Curtis Huttenhower, Gavin A. Huttley, Stefan Janssen, Alan K. Jarmusch, Lingjing Jiang, Benjamin D. Kaehler, Kyo Bin Kang, Christopher R. Keefe, Paul Keim, Scott T. Kelley, Dan Knights, Irina Koester, Tomasz Kosciolek, Jorden Kreps, Morgan G. I. Langille, Joslynn Lee, Ruth Ley, **Yong-Xin Liu**, Erikka Loftfield, Catherine Lozupone, Massoud Maher, Clarisse Marotz, Bryan D. Martin, Daniel McDonald, Lauren J. McIver, Alexey V. Melnik, Jessica L. Metcalf, Sydney C. Morgan, Jamie T. Morton, Ahmad Turan Naimey, Jose A. Navas-Molina, Louis Felix Nothias, Stephanie B. Orchanian, Talima Pearson, Samuel L. Peoples, Daniel Petras, Mary Lai Preuss, Elmar Pruesse, Lasse Buur Rasmussen, Adam Rivers, Michael S. Robeson, Patrick Rosenthal, Nicola Segata, Michael Shaffer, Arron Shiffer, Rashmi Sinha, Se Jin Song, John R. Spear, Austin D. Swafford, Luke R. Thompson, Pedro J. Torres, Pauline Trinh, Anupriya Tripathi, Peter J. Turnbaugh, Sabah Ul-Hasan, Justin J. J. van der Hooft, Fernando Vargas, Yoshiki Vázquez-Baeza, Emily Vogtmann, Max von Hippel, William Walters, Yunhu Wan, Mingxun Wang, Jonathan Warren, Kyle C. Weber, Charles H. D. Williamson, Amy D. Willis, Zhenjiang Zech Xu, Jesse R. Zaneveld, Yilong Zhang, Qiyun Zhu, Rob Knight & J. Gregory Caporaso#. Reproducible, interactive, scalable and extensible microbiome data science using QIIME 2. ***Nature Biotechnology***. 2019, 37: 852-857. doi:[10.1038/s41587-019-0209-9](https://doi.org/10.1038/s41587-019-0209-9)

Kang, D.-W., Adams, J.B., Gregory, A.C., Borody, T., Chittick, L., Fasano, A., Khoruts, A., Geis, E., Maldonado, J., McDonough-Means, S., Pollard, E.L., Roux, S., Sadowsky, M.J., Lipson, K.S., Sullivan, M.B., Caporaso, J.G., and Krajmalnik-Brown, R. (2017). Microbiota Transfer Therapy alters gut ecosystem and improves gastrointestinal and autism symptoms: an open-label study. Microbiome 5, 10. https://doi.org/10.1186/s40168-016-0225-7


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