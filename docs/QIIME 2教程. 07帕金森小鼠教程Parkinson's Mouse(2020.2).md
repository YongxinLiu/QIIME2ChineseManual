[TOC]

# 前情提要

- [NBT：QIIME 2可重复、交互式的微生物组分析平台](https://mp.weixin.qq.com/s/-_FHxF1XUBNF4qMV1HLPkg)
- [1简介和安装Introduction&Install](https://mp.weixin.qq.com/s/vlc2uIaWnPSMhPBeQtPR4w)
- [2插件工作流程概述Workflow](https://mp.weixin.qq.com/s/qXlx1a8OQN9Ar7HYIC3OqQ)
- [3老司机上路指南Experienced](https://mp.weixin.qq.com/s/gJZCRzenCplCiOsDRHLhjw)
- [4人体各部位微生物组分析Moving Pictures](https://mp.weixin.qq.com/s/c8ZQegtfNBHZRVjjn5Gyrw)，[Genome Biology：人体各部位微生物组时间序列分析](https://mp.weixin.qq.com/s/DhecHNqv4UjYpVEu48oXAw)
- [5粪菌移植分析练习FMT](https://mp.weixin.qq.com/s/cqzpLOprpClaib1FvH7bjg)，[Microbiome：粪菌移植改善自闭症](https://mp.weixin.qq.com/s/PHpg0y6_mydtCXYUwZa2Yg)
- [6沙漠土壤分析Atacama soil](https://mp.weixin.qq.com/s/tmXAjkl7oW3X4uagLOJu2A)，[mSystems：干旱对土壤微生物组的影响](https://mp.weixin.qq.com/s/3tF6_CfSKBbtLQU4G3NpEQ)
- [Cell：肠道菌群促进帕金森发生ParkinsonDisease](https://mp.weixin.qq.com/s/OINhALYIaH-JZICpU68icQ)

# QIIME 2用户文档. 7帕金森小鼠教程

**Parkinson’s Mouse Tutorial**

原文地址：https://docs.qiime2.org/2020.2/tutorials/pd-mice/


本教程将使用来自[人源化(humanized)小鼠](https://en.wikipedia.org/wiki/Humanized_mouse)的一组粪便样品，展示16S rRNA基因扩增子数据的“典型”QIIME 2分析。最初的研究，[Sampson等，2016](https://www.ncbi.nlm.nih.gov/pubmed/27912057)旨在确定粪便微生物组是否有助于帕金森病（Parkinson’s Disease, PD）的发展。一些观察研究显示PD患者和对照之间的微生物组存在差异，尽管研究中发现的物种不一致。然而，这足以证明PD与粪便微生物组之间可能存在关联。

![image](http://210.75.224.110/Note/LiuYongXin/161201Cell/cover.jpg)

Timothy R. Sampson, et. al. Gut Microbiota Regulate Motor Deficits and Neuroinflammation in a Model of Parkinson's Disease. Cell 167, 1469-1480.e1412, doi:10.1016/j.cell.2016.11.018 (2016).

为了确定这种关系是偶然的还是实际上与疾病相关需要进一步研究。人类队列研究不可行，因为该疾病仅影响60岁以上人口的1％左右，PD需要很长时间才能发展和诊断，而且很难确定何时该采集样本。因此，利用无菌(gnotobiotic)小鼠研究来评估微生物组在PD症状发展中的作用。从6名患有帕金森病的供体和6名年龄和性别匹配的神经健康对照中收集粪便，然后将其移植到因突变（“aSyn”）或抗性野生型小鼠而易患帕金森病的小鼠（“ BDF 1” ）。将来自不同供体的小鼠保持在分开的笼子中，但是共同圈养来自不同遗传背景的小鼠。跟踪小鼠7周，看他们是否出现帕金森病的症状。

我们将查看来自两个人类供体（一个健康和一个PD）的数据的子集，其样品各自被移植到来自易感基因型的三个独立的小鼠笼中。对于本教程，已准备好元数据的子集，并且已对每个样本的序列进行二次采样，大约5000条序列，以使教程能够在短时间内运行。完整研究的序列可在EBI获得，[登记号为 `PRJEB17694` ](https://www.ebi.ac.uk/ena/data/view/PRJEB17694); 完整研究中的处理表可以从[Qiita数据库的研究10483](https://qiita.ucsd.edu/)中下载。

## 本节视频视频教程

https://v.qq.com/x/page/b3007nt4hby.html

视频有广告，清晰度不够高吗？在公众号“**宏基因组(meta-genome)**”后台回复“qiime2”获得1080p视频和测试数据下载链接。


## 假设

Hypothesis

本教程将探讨人源化小鼠的遗传背景影响微生物群落的假设。 然而，我们还需要考虑其他可能驱动微生物结构而不是小鼠基因型的混杂因素。

## 启动QIIME2运行环境

要求完成本节分析，你需要安装好QIIME 2，参见《[1简介和安装Introduction&Install](https://mp.weixin.qq.com/s/vlc2uIaWnPSMhPBeQtPR4w)（2020.2版）》。

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
mkdir -p mouse_tutorial
cd mouse_tutorial
```

## 元数据

**Metadata**

在开始任何分析之前，熟悉元数据很重要。 在本研究中，元数据文件包含7列。

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.7.0.png)

即使`mouse ID`看起来像一个数字，我们也会使用`＃q2_type`指令指定它是分类型数据。


注意：**QIIME 2 官方测试数据部分保存在Google服务器上，国内下载比较困难**。可使用代理服务器(如蓝灯)下载 https://data.qiime2.org/2020.2/tutorials/pd-mice/sample_metadata.tsv ，或**微信订阅号回复"qiime2"获取测试数据批量下载链接，这样你就可以跳过下面的wget步骤**。

**下载来源Google文档的实验设计**

```
wget \
  -O "metadata.tsv" \
  "https://data.qiime2.org/2020.2/tutorials/pd-mice/sample_metadata.tsv"
```

整个教程将使用示例元数据。 让我们运行我们的第一个QIIME 2命令，来总结和探索元数据。

```
qiime metadata tabulate \
  --m-input-file metadata.tsv \
  --o-visualization metadata.qzv
```

- `metadata.qzv`：元数据可视化，生成交互式表格在网页在查看，可按任意列排序。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fmetadata.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/metadata.qzv)

## 数据导入QIIME 2

**Importing data into QIIME 2**

在QIIME 2中，所有数据都被构造为特定语义类型的对象。对象包含数据以及有关数据的信息，包括原始数据的记录和用于处理数据的工具。这样可以更好地跟踪您实际到达分析中的位置。您可以在[此处了解有关常见QIIME 2对象和语义类型的更多信息](https://docs.qiime2.org/2020.2/semantic-types/)。

我们的样品使用[EMP 515f-806r引物扩增](http://www.earthmicrobiome.org/protocols-and-standards/16s/)，并在Illumina MiSeq上用2x150bp试剂盒测序。我们使用的引物覆盖的高变区长290bp，因此，对于150bp的读数，我们的序列将略微过短，无法在下游进行配对末端分析。因此，我们将使用单端序列。我们将使用已经按标签拆分好样本的版本，例如由测序中心拆分。如果您需要对序列进行自行样本拆分，“《[人体各部位微生物组分析Moving Picture](https://mp.weixin.qq.com/s/c8ZQegtfNBHZRVjjn5Gyrw)（2020.2版）》”教程将介绍如果使用Earth Microbiome Project协议对序列进行测序，则对应如何对序列进行拆分。(**详者注：拆分方法与测序的实验方法对应，建议由你的测序服务商或合作者提供拆分为单个样本的单端或双端序列，并要确定是否已经去除了引物和标签序列**)

我们将序列导入为`SampleData [SequencesWithQuality]`，这是拆分后的单端序列格式。如果我们想导入双端序列，我们将指定语义类型`SampleData [PairedEndSequencesWithQuality]`。**我们将使用[样本清单格式(manifest format)](https://docs.qiime2.org/2020.2/tutorials/importing/#manifest-file)导入序列，这是一种在QIIME 2中导入拆分样本数据的通用方法**。我们创建一个以制表符分隔的样本清单文件，将我们要在QIIME 2中使用的**样本名称映射到序列文件的路径**。好处是可以将单样本的序列文件命名为您想要的任何名称；没有关于约定的固定假设，文件名也没有规定最终名称。当QIIME 2读取文件时，它会忽略前缀为`＃`符号的任何行。但不包含`＃`的第一行，因为它是标题行，必须是`sample-id <TAB> absolute-filepath`。标题行后的样本顺序无关紧要。阅读有关将[数据导入QIIME 2对象](https://docs.qiime2.org/2020.2/tutorials/importing/)的更多信息，以及[有关示例元数据格式要求的更多信息](https://docs.qiime2.org/2020.2/tutorials/metadata/)。

让我们从下载清单和相应的序列开始。

```
# 下载文件清单
wget -c \
  -O "manifest.tsv" \
  "https://data.qiime2.org/2020.2/tutorials/pd-mice/manifest"

# 下载序列压缩包，21M文件，我下载了1-10m不等
wget -c \
  -O "demultiplexed_seqs.zip" \
  "https://data.qiime2.org/2020.2/tutorials/pd-mice/demultiplexed_seqs.zip"

# 解压序列数据
unzip demultiplexed_seqs.zip

# 查看清单文件
head -n3 manifest.tsv
```

文件内容示例

```
sample-id	absolute-filepath
recip.220.WT.OB1.D7	$PWD/demuliplexed_seqs/10483.recip.220.WT.OB1.D7_30_L001_R1_001.fastq.gz
recip.290.ASO.OB2.D1	$PWD/demuliplexed_seqs/10483.recip.290.ASO.OB2.D1_27_L001_R1_001.fastq.gz
```

使用此清单格式时，样本名称只能出现在一行中，并且每列只能映射到每列一个文件名（单端为一列，双端为两列）。 每个样本的绝对文件路径必须是绝对路径，它指定文件的“完整”位置。 我们在这里使用`$ PWD`变量，它以绝对值扩展当前目录。

使用文件清单导入数据

```
# 导入21M数据，15s
time qiime tools import \
  --type "SampleData[SequencesWithQuality]" \
  --input-format SingleEndFastqManifestPhred33V2 \
  --input-path ./manifest.tsv \
  --output-path ./demux_seqs.qza
```
让我们使用`qiime demux summary`命令检查样本的序列和测序深度，它提供每个样本中序列数及序列质量的信息。在运行命令之前，让我们查看帮助文档，以确保我们了解该命令的参数。

`qiime demux summarize --help`

根据文档，我们应该为`--i-data`参数指定输入文件（已拆分序列的文件或叫“对象”），语义类型为SampleData [SequencesWithQuality]。 我们通过`--o-visualization`来设定输出路径，指定文件保存的位置。帮助文档是所有命令的参考资料，从中你还可以查找到错误信息，尤其是有关参数的报错信息。

```
# 导入数据的可视化，9s
time qiime demux summarize \
  --i-data ./demux_seqs.qza \
  --o-visualization ./demux_seqs.qzv
```

- `demux_seqs.qzv`：元数据可视化，生成交互式表格在网页在查看，可按任意列排序。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fdemux_seqs.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/demux_seqs.qza)

问题

1. 拆分后，哪个样本的测序深度最低？

2. 序列长度中位数是多少？

3. 125位的中位数质量得分是多少？

4. 如果您正在与其他人一起学习本教程，为什么您的细节与您的邻居略有不同？ 如果您没有与其他人一起工作，请尝试运行此命令多次并比较结果的细微变化。

> 译者注：以上问题查看`demux_seqs.qzv`很容易找到答案。

> 详者注参考答案：
1. 使用`https://view.qiime2.or`查看`demux_seqs.qzv`页面的底部，即最小样本量的样本`recip.460.WT.HC3.D14`
2. 查看Interactive Quality Plot页面，最下面的表格有长度的中位数:`150 nts
`
3. 鼠在当前页面中质量箱线图中划动，找到125位碱基，质量中位数显示在下表中，为38
4. 因为质量值评估，不是对所有数据评估，是从数据中随机抽样一部数据，但足以反映整体的情况，每次会略有不同。数据分析中，使用随机的过程，结果都可能存在不确定性，如抽样、随机森林分析等。

> **小测试**
> 
> 考虑修剪和/或截断的合适位置是什么？

## 序列质量控制和特征表

**Sequence quality control and feature table**

有几种方法可以在QIIME 2中构建特征表。第一个主要选择是使用操作分类单元（Operational Taxonomic Units，OTU）或扩增/绝对序列变体（Absolute Sequence Variants，ASV）。自2010年中期以来，OTU已广泛用于微生物组研究，并基于参考数据库或从头将序列分配给聚类。 QIIME 2目前通过[`q2-vsearch`](https://docs.qiime2.org/2020.2/tutorials/otu-clustering/)和[`q2-dbOTU`](https://library.qiime2.org/plugins/q2-dbotu/4/)插件提供聚类。

与传统的基于OTU的方法相比，ASV是最近发展的新一代方法，在功能上提供更好的分辨率。 ASV可以基于400bp或更多序列中单个核苷酸的差异来分离特征，甚至超过99％同一性OTU聚类的分辨率。 QIIME 2目前通过[DADA2（q2-dada2）](https://www.ncbi.nlm.nih.gov/pubmed/27214047)和[Deblur（q2-deblur）](https://www.ncbi.nlm.nih.gov/pubmed/28289731)提供去噪。 [Nearing等人，2018年很好地描述了主要去噪算法的动机的主要差异](https://www.ncbi.nlm.nih.gov/pubmed/30123705)。

值得注意的是，在任何一种情况下，对序列进行ASV去噪或OTU进行聚类是分开的，即并行步骤。应该选择单一方法：去噪或基于OTU的聚类; 不建议将这些步骤组合在一起（当然也存在组合方法，但我们不推荐）。

在本教程中，我们将使用DADA2进行去噪（使用单端序列）。有关在配对末端序列上使用DADA2的示例，请参阅[Atacama Soil教程](https://docs.qiime2.org/2020.2/tutorials/atacama-soils/)。对于那些对使用Deblur感兴趣的人，你可以参考[《4人体各部位微生物组分析MovingPicture》](https://mp.weixin.qq.com/s/c8ZQegtfNBHZRVjjn5Gyrw)和阅读[序列合并的替代方法](https://docs.qiime2.org/2020.2/tutorials/read-joining/)，分别在单端和双端序列上运行Deblur。

`qiime dada2 denoise-single`方法要求我们设置`--p-trunc-len`参数。这可以控制序列的长度，并应根据质量得分的下降进行选择。在我们的数据集中，质量得分在测序运行中相对均匀分布，因此我们将使用完整的150 bp序列。然而，修剪长度的选择是相对主观的测量结果，并且依赖于数据分析人员的决策能力。

```
# 注：./代表当前目录，可以省略，也可替换为你数据所在或想保存的任何位置
# 时间2m55s，此步大数据可能需数小时或数天
time qiime dada2 denoise-single \
  --i-demultiplexed-seqs ./demux_seqs.qza \
  --p-trunc-len 150 \
  --o-table ./dada2_table.qza \
  --o-representative-sequences ./dada2_rep_set.qza \
  --o-denoising-stats ./dada2_stats.qza
```

20M的测试数据，用时2分30s。

**输出对象：**

- `dada2_stats.qza`：元数据可视化，生成交互式表格在网页在查看，可按任意列排序。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fdada2_stats.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/dada2_stats.qza)
- `dada2_table.qza`：元数据可视化，生成交互式表格在网页在查看，可按任意列排序。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fdada2_table.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/dada2_table.qza)
- `dada2_rep_set.qza`：元数据可视化，生成交互式表格在网页在查看，可按任意列排序。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fdada2_rep_set.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/dada2_rep_set.qza)

我们可以使用`qiime metadata tabulate`命令来可视化统计结果

```
# 5s
time qiime metadata tabulate \
  --m-input-file ./dada2_stats.qza  \
  --o-visualization ./dada2_stats.qzv
```

可视化结果:

- `dada2_stats.qzv`：元数据可视化，生成交互式表格在网页在查看，可按任意列排序。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fdada2_stats.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/dada2_stats.qzv)

## 特征表摘要

Feature table summary

在我们完成对数据进行去噪后，我们可以通过查看特征表的摘要来检查结果。 这将为我们提供与每个序列和每个特征相关的计数，以及其他有用的图和指标。

```
# 7s
time qiime feature-table summarize \
  --i-table ./dada2_table.qza \
  --m-sample-metadata-file ./metadata.tsv \
  --o-visualization ./dada2_table.qzv
```

- `dada2_table.qzv`：元数据可视化，生成交互式表格在网页在查看，可按任意列排序。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fdada2_table.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/dada2_table.qzv)


问题：

1. 去噪后剩余多少特征？
2. 哪个样本的特征总数最多？ 在DADA2去噪之前，该样本有多少个序列？
3. 有多少样本的总特征小于4250？
4. 在至少47个样品中观察到哪些特征？
5. 哪个样本特征最少？ 它有多少？
6. 如果打开去噪摘要，是否可以找到序列最少的样本失败的步骤？

> 详者注：参考答案
> 1. 使用 https://view.qiime2.org 查看`dada2_table.qzv`样本，第一页`Table summary`中的Number of features有287个。
> 2. 查看`dada2_table.qzv`中`Interactive Sample Detail`，中每个样本的`Feature Count`按数量排序，其中recip.539.ASO.PD4.D14	样本的特征总数最多，共有4996条；去噪前的序列数，需要查看`dada2_stats.qzv`文件，查找`recip.539.ASO.PD4.D14`，发现input原始序列为5475条。 
> 3. 查看`dada2_table.qzv`中`Interactive Sample Detail`，显示48个样品，输入4250显示剩余26。即22个样本小于4250。
> 4. 查看`dada2_table.qzv`中`Feature Detail`中查看，只有3个特征在47个样品中。
> 5. 查看`dada2_table.qzv`中`Interactive Sample Detail`，最底部的样本为`recip.460.WT.HC3.D49`特征最少，只有347个。
> 6. 查看`dada2_stats.qzv`文件，查找`recip.460.WT.HC3.D49`，发现input原始序列为16327条，过滤后为9919条，去噪后为347条，估计可能为质量太低被去除。 

## 构建多样性分析所需的进化树

Generating a phylogenetic tree for diversity analysis

QIIME 2分析允许将系统发育树用于多样性指标，例如Faith的系统发育多样性和UniFrac距离以及基于特征的Gneiss分析。树为数据提供了固有的结构，使我们能够考虑生物之间的进化关系。

QIIME 2提供了几种构建系统发育树的方法。在本教程中，我们将使用`q2-fragment-insertion`插件创建一个片段插入树。片段插入插件的作者表明，它可以通过基于Illumina短读长，与较大序列构建的参考树对齐，优于传统的基于比对的方法。我们的命令`qiime fragment-insertion sepp`将使用我们在去噪期间生成的代表序列（`FeatureData[Sequence]`对象）来创建系统发育树，其中序列已插入到greengenes 13_8 99％相似度的参考树骨架中。

> 注意
> 此命令是资源密集型的 - 如果您的计算环境支持它，我们建议包括一个适当设置的`--p-threads`参数。

先下载sepp-refs-gg-13-8.qza
```
wget -c \
  -O "sepp-refs-gg-13-8.qza" \
  "https://data.qiime2.org/2020.2/common/sepp-refs-gg-13-8.qza"
```

```
# 多线程服务器，可调多线程加速
time qiime fragment-insertion sepp \
  --i-representative-sequences ./dada2_rep_set.qza \
  --i-reference-database sepp-refs-gg-13-8.qza \
  --o-tree ./tree.qza \
  --o-placements ./tree_placements.qza \
  --p-threads 1  # update to a higher number if you can
```

测序中，1线程计算35m，9线程用时15m。多线程是缩短时间，但使用机时长达3小时以上，总体效率下降明显。

输出对象:

- `sepp-refs-gg-13-8.qza`: Greengenes 13_8 版本99%相似性参考树骨架文件。[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fsepp-refs-gg-13-8.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/sepp-refs-gg-13-8.qza)
- `tree_placements.qza`：插值法的树文件。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Ftree_placements.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/tree_placements.qza)
- `tree.qza`：树文件。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Ftree.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/tree.qza)

## Alpha稀疏和深度选择

Alpha Rarefaction and Selecting a Rarefaction Depth

我们现在有一个包含每个样本ASV的特征表（观察矩阵），以及代表这些ASV的系统发育树，因此几乎准备好对微生物多样性进行各种分析。但是，首先我们必须对数据进行标准化，以解决样本之间不均匀的测序深度。

尽管微生物组样本中的测序深度与群落中的原始生物量没有直接关系，但相对测序深度对观察到的群落具有很大影响[（Weiss等，2017）](https://www.ncbi.nlm.nih.gov/pubmed/28253908)。因此，对于大多数多样性度量，需要标准化方法。

目前的最佳实践建议使用稀疏，通过二次取样进行标准化而无需替换。稀疏发生在两个步骤中：首先，低于稀疏深度的样本被从特征表中滤掉。然后，对所有剩余样本进行无放回采样以达到指定的测序深度。选择稀疏深度进行多样性分析既重要又有时具有挑战性。有几种策略可以找出适当的稀疏深度 - 我们将在本教程中主要考虑alpha稀疏，因为它是一种解决问题的数据驱动方式。

我们将使用`qiime diversity alpha-rarefaction`在不同深度（在`--p-min-depth`和`--p-max-depth`之间）对ASV表进行子采样，并使用一个或多个度量来计算alpha多样性（`--p-metrics`）。当我们检查特征表时，我们发现在去噪表中具有最少序列的样本具有85个特征，并且具有最多具有4996个特征的样本。我们希望将最大深度设置为接近最大序列数。我们也知道，如果我们查看每个样本4250个序列的测序深度，我们将查看22个样本的信息。所以，让我们将其设置为我们的最大测序深度。

在每个采样深度，通常计算10个稀疏表以提供误差估计，尽管可以使用`--p-iterations`参数进行调整。我们可以通过指定`--m-metadata-file`参数的元数据文件来检查并查看alpha多样性和元数据之间是否存在关系。

```
# 用时15s
time qiime diversity alpha-rarefaction \
  --i-table ./dada2_table.qza \
  --m-metadata-file ./metadata.tsv \
  --o-visualization ./alpha_rarefaction_curves.qzv \
  --p-min-depth 10 \
  --p-max-depth 4250
```

- `alpha_rarefaction_curves.qzv`：alpha稀疏曲线。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Falpha_rarefaction_curves.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/alpha_rarefaction_curves.qzv)

可视化文件将显示两个图。上图将显示作为采样深度函数的α多样性（观察到的OTU或shannon）。这用于基于采样深度确定丰富度或均匀度是否已饱和。当您接近最大采样深度时，稀疏曲线应“平稳”。如果不这样做，特别是对于仅有多样性的度量，例如观察到的OTU或Faith的PD多样性，可能表明样本中的丰富度尚未完全饱和。

第二个图显示了每个采样深度的每个元数据类别组中的样本数。这对于确定样本丢失的采样深度以及元数据列组值是否存在偏差非常有用。请记住，稀疏是一个两步过程，不满足稀疏深度的样本将从表中过滤掉。我们可以使用曲线来查看不同元数据列的样本数。

如果您仍然不确定稀疏深度，还可以使用示例摘要通过将样本元数据提供给特征表(`dada2_table.qzv`)摘要来查看丢失的样本。

> 问题
> 
> 首先打开alpha稀疏可视化。
> 
> 1. 是否在可视化中表示了所有元数据列？如果没有，哪些列被排除，为什么？
> 2. 哪个指标显示多样性的饱和度和稳定性？
> 3. 基于曲线，哪种小鼠遗传背景具有更高的多样性？哪个采样深度较浅？
> 
> 现在，让我们检查特征表摘要。
> 
> 4. 如果我们将稀疏深度设置为每个样本2500个序列，则会丢失多少百分比的样本？
> 5. 丢失样品来自哪些老鼠？
> 
> 
> 参考答案（译者注）
> 
> 首先使用`https://view.qiime2.org`打开alpha稀疏可视化`alpha_rarefaction_curves.qzv`。
> 
> 1. 我们查看`cat metadata.tsv`中除样本名外的元数据共有8列，在网页中`Sample Metaadata Colmn`中只有7类，没有全部元数据列。比较发现`days_post_transplant`缺失，原因为此列为连续型变量，而不是分类型变量。
> 2. Metric中的`observed_otus`指标显示多样性的饱和度和稳定性，如选择`cage_id`分组，可到各种曲线开始快速上升，后期趋于平滑。
> 3. 分组切换为`genotype`，观察到wild type有较高的多样性。观察下面的图，开始wild type采样较浅，`susceptible`中所有24个样本均大于3500。

> 
> 现在，让我们检查特征表摘要。
> 
> 4. 我们打开`dada2_table.qzv`，在`Interactive Sample Detail`中`Sampling Depth`，如果我们将稀疏深度设置为每个样本2500个序列，显示91.67%剩余，则会丢失百分之8.37%(4)的样本。
> 5. 我们切换Metadata为mouse_id，丢失样品来自457，469，538，538四种老鼠。


在我们查看了数据之后，我们需要选择一个稀疏深度。一般而言，选择稀疏深度是一个主观过程，需要分析师自行决定。**选择稀疏深度是最大限度地减少序列损失，同时最大化保留用于多样性分析的序列**。对于高生物量样品（粪便，口腔等），一般的最佳估计是**每个样品的稀疏深度不少于1000个序列**。在**测序较浅的低生物量样品**中，可以选择较低的稀疏深度，但重要的是要记住，这些样品的**多样性测量将是非常嘈杂的并且总体质量将是低的**。

> 小测验
> 
> 根据当前的稀疏曲线和样本摘要，您会选择什么样的测序深度？为什么？
> 
> 在这种情况下，我们可以保留47个稀疏深度为2000个序列/样本的样本。
> 
> 根据测序深度和样品分布，我们将使用2000个序列/样品进行分析。这将使我们保留48个高质量样品中的47个（丢弃一个样品，测序深度低于1000个序列/样品）。


## 多样性分析

Diversity analysis

微生物生态学假设检验的第一步通常是研究 - 样本同 （α）和样本间（β）多样性。我们可以使用`q2-diversity`插件计算多样性指标，应用适当的统计检验，并可视化数据。

我们将首先使用`qiime diversity core-metrics-phylogenetic`方法，该方法输入文件为特征表，计算几种常用的α和β多样性度量，并在Emperor中为β多样性生成主坐标分析（PCoA）可视化。默认情况下，计算的指标是：

- Alpha多样性
    - Shannon’s diversity index
    - Observed OTUs
    - Faith’s phylogenetic diversity
    - Pielou’s evenness
- Beta多样性
    - Jaccard distance
    - Bray-Curtis distance
    - Unweighted UniFrac distance
    - Weighted UniFrac distance

[Stephanie Orchanian在论坛帖子中对多样性指标及其含义进行了非常好的讨论。](https://forum.qiime2.org/t/alpha-and-beta-diversity-explanations-and-commands/2282/)

`qiime diversity core-metrics-phylogenetic`方法包含了其他几种方法，值得注意的是，这些步骤也可以独立执行。

多样性计算的一个重要考虑因素是稀疏深度。在上面，我们使用alpha稀疏可视化和样本摘要可视化来选择稀疏深度。因此，对于这些分析，我们将使用每个样本2000个序列的深度。

```
# 计算多样性，23s
time qiime diversity core-metrics-phylogenetic \
  --i-table ./dada2_table.qza \
  --i-phylogeny ./tree.qza \
  --m-metadata-file ./metadata.tsv \
  --p-sampling-depth 2000 \
  --output-dir ./core-metrics-results
```

**输出对象**:

- `core-metrics-results/faith_pd_vector.qza`: 。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcore-metrics-results%2Ffaith_pd_vector.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/core-metrics-results/faith_pd_vector.qza)
- `core-metrics-results/unweighted_unifrac_distance_matrix.qza`: 。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcore-metrics-results%2Funweighted_unifrac_distance_matrix.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/core-metrics-results/unweighted_unifrac_distance_matrix.qza)
- `core-metrics-results/bray_curtis_pcoa_results.qza`:。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcore-metrics-results%2Fbray_curtis_pcoa_results.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/core-metrics-results/bray_curtis_pcoa_results.qza)
- `core-metrics-results/shannon_vector.qza`: 。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcore-metrics-results%2Fshannon_vector.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/core-metrics-results/shannon_vector.qza)
- `core-metrics-results/rarefied_table.qza`: 。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcore-metrics-results%2Frarefied_table.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/core-metrics-results/rarefied_table.qza)
- `core-metrics-results/weighted_unifrac_distance_matrix.qza`: 。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcore-metrics-results%2Fweighted_unifrac_distance_matrix.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/core-metrics-results/weighted_unifrac_distance_matrix.qza)
- `core-metrics-results/jaccard_pcoa_results.qza`: 。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcore-metrics-results%2Fjaccard_pcoa_results.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/core-metrics-results/jaccard_pcoa_results.qza)
- `core-metrics-results/observed_otus_vector.qza`: 。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcore-metrics-results%2Fobserved_otus_vector.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/core-metrics-results/observed_otus_vector.qza)
- `core-metrics-results/weighted_unifrac_pcoa_results.qza`: 。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcore-metrics-results%2Fweighted_unifrac_pcoa_results.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/core-metrics-results/weighted_unifrac_pcoa_results.qza)
- `core-metrics-results/jaccard_distance_matrix.qza`: 。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcore-metrics-results%2Fjaccard_distance_matrix.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/core-metrics-results/jaccard_distance_matrix.qza)
- `core-metrics-results/evenness_vector.qza`: 。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcore-metrics-results%2Fevenness_vector.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/core-metrics-results/evenness_vector.qza)
- `core-metrics-results/bray_curtis_distance_matrix.qza`: 。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcore-metrics-results%2Fbray_curtis_distance_matrix.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/core-metrics-results/bray_curtis_distance_matrix.qza)
- `core-metrics-results/unweighted_unifrac_pcoa_results.qza`: 。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcore-metrics-results%2Funweighted_unifrac_pcoa_results.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/core-metrics-results/unweighted_unifrac_pcoa_results.qza)

**输出可视化**:

- `core-metrics-results/unweighted_unifrac_emperor.qzv`: 。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcore-metrics-results%2Funweighted_unifrac_emperor.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/core-metrics-results/unweighted_unifrac_emperor.qzv)
- `core-metrics-results/jaccard_emperor.qzv`: 。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcore-metrics-results%2Fjaccard_emperor.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/core-metrics-results/jaccard_emperor.qzv)
- `core-metrics-results/bray_curtis_emperor.qzv`: 。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcore-metrics-results%2Fbray_curtis_emperor.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/core-metrics-results/bray_curtis_emperor.qzv)
- `core-metrics-results/weighted_unifrac_emperor.qzv`: 。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcore-metrics-results%2Fweighted_unifrac_emperor.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/core-metrics-results/weighted_unifrac_emperor.qzv)

> 问题：我们从哪里获得2000的参数值？ 我们为什么选择那个？

### Alpha多样性

Alpha diversity

Alpha多样性查询样本（或样本组）中的特征分布是否在不同条件之间不同。 该比较没有假设样本之间共享的特征;  两个样本可以具有相同的alpha多样性，并且不共享任何特征。 `q2-diversity`产生的稀疏α多样性是一个单变量的连续值，可以使用常见的非参数统计检验进行检验。

我们可以通过运行以下方法测试我们感兴趣的协变量对Faith系统发育多样性(Faith’s phylogenetic diversity)和Pielou均匀度(Pielou’s evenness)值：

```
time qiime diversity alpha-group-significance \
  --i-alpha-diversity ./core-metrics-results/faith_pd_vector.qza \
  --m-metadata-file ./metadata.tsv \
  --o-visualization ./core-metrics-results/faiths_pd_statistics.qzv
```

可视化结果:

- `core-metrics-results/faiths_pd_statistics.qzv`: faiths_pd指数按元数据的统计可视化。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcore-metrics-results%2Ffaiths_pd_statistics.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/core-metrics-results/faiths_pd_statistics.qzv)

```
# 5s
time qiime diversity alpha-group-significance \
 --i-alpha-diversity ./core-metrics-results/evenness_vector.qza \
 --m-metadata-file ./metadata.tsv \
 --o-visualization ./core-metrics-results/evenness_statistics.qzv
```

可视化结果:

- `core-metrics-results/evenness_statistics.qzv`: 均匀度指数按元数据的统计可视化。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcore-metrics-results%2Fevenness_statistics.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/core-metrics-results/evenness_statistics.qzv)

问题：

1. 基因型之间的均匀性是否存在差异？ 基因型之间的系统发育多样性是否存在差异？
2. 基于组间显着性检验，基因型的系统发育多样性是否存在差异？ 基于捐赠者是否存在差异？

> 参考答案（译者注）
> 
> 1. 我们查看`evenness_statistics.qzv`，列名Column选择genotype，观察图形差异不明显，观察下方P值不显著。
> 2. 同样观察`faiths_pd_statistics.qzv`中的基因型，P值不显著(P=0。08)。切换为donor分组，差异显著（P=0.01, Kruskal-Wallis test）


如果我们有一个我们认为与α多样性相关的连续协变量，我们可以使用`qiime diversity alpha-correlation`来进行检验。 但是，此数据集中唯一的连续变量是`days_since_transplant`。

在一些实验中，多个相互作用的因素可能共同影响α多样性。 **如果我们的α多样性估计遵循正态分布，我们可以使用方差分析**（ANOVA）来测试多重效应是否显着影响α多样性。 此测试存在于`q2-longitudinal`插件中：

```
time qiime longitudinal anova \
  --m-metadata-file ./core-metrics-results/faith_pd_vector.qza \
  --m-metadata-file ./metadata.tsv \
  --p-formula 'faith_pd ~ genotype * donor_status' \
  --o-visualization ./core-metrics-results/faiths_pd_anova.qzv
```

- `core-metrics-results/faiths_pd_anova.qzv`: faiths_pd指数按元数据分组交互计算的anova统计可视化。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcore-metrics-results%2Ffaiths_pd_anova.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/core-metrics-results/faiths_pd_anova.qzv)

### Beta多样性

Beta diversity

接下来，我们将使用β多样性比较微生物群落的结构。首先目视检查由`q2-emperor`和`core-metrics-results/weighted_unifrac_emperor.qzv`生成的主坐标分析（PCoA）图。

问题

1. 首先打开未加权的UniFrac emperor图（`core-metrics-results/unweighted_unifrac_emperor.qzv`）。你能找到数据中的明显分离吗？您能找到反映分离的元数据因子吗？如果您使用加权的UniFrac距离（`core-metrics-results/weighted_unifrac_emperor.qzv`）怎么办？
2. 小鼠研究的主要问题之一是有时群落的差异是由于每个笼子的自然变异。你看到每个笼子中的样本聚集在一起了吗？

现在，让我们使用[PERMANOVA](https://onlinelibrary.wiley.com/doi/abs/10.1111/j.1442-9993.2001.01070.pp.x)分析统计趋势。 PERMANOVA测试的假设是，一组内的样本彼此之间的相似性比另一组中的样本更相似。换句话说，它测试每组的组内距离是否与组间距离不同。我们期望相似的样本彼此之间的距离较小，因此如果我们假设一组不同于另一组是正确的，那么我们期望组内距离小于组间距离。

让我们使用`beta-group-significance`命令来测试供体身份（我们定性地确定为PCoA空间中的主要分隔符）是否与加权和未加权UniFrac距离的显着差异相关联。

```
# 6s
time qiime diversity beta-group-significance \
  --i-distance-matrix core-metrics-results/unweighted_unifrac_distance_matrix.qza \
  --m-metadata-file metadata.tsv \
  --m-metadata-column donor \
  --o-visualization core-metrics-results/unweighted-unifrac-donor-significance.qzv

# 5s
time qiime diversity beta-group-significance \
  --i-distance-matrix core-metrics-results/weighted_unifrac_distance_matrix.qza \
  --m-metadata-file metadata.tsv \
  --m-metadata-column donor \
  --o-visualization core-metrics-results/weighted-unifrac-donor-significance.qzv
```

可视化结果:

- `core-metrics-results/weighted-unifrac-donor-significance.qzv`: 。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcore-metrics-results%2Fweighted-unifrac-donor-significance.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/core-metrics-results/weighted-unifrac-donor-significance.qzv)
- `core-metrics-results/unweighted-unifrac-donor-significance.qzv`: 。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcore-metrics-results%2Funweighted-unifrac-donor-significance.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/core-metrics-results/unweighted-unifrac-donor-significance.qzv)

我们还要检查小鼠所在的笼子与β多样性之间是否存在关系，因为“笼子效应”通常是一个需要考虑的重要技术效果。 由于我们有几个笼子，我们将使用`--p-pairwise`参数，让我们检查驱动差异的笼子之间是否存在个体差异。 这可能很有用，因为如果我们检查元数据，我们可能会发现笼子是由捐赠者嵌套的。

```
# 9s
time qiime diversity beta-group-significance \
  --i-distance-matrix core-metrics-results/unweighted_unifrac_distance_matrix.qza \
  --m-metadata-file metadata.tsv \
  --m-metadata-column cage_id \
  --o-visualization core-metrics-results/unweighted-unifrac-cage-significance.qzv \
  --p-pairwise

# 9s
time qiime diversity beta-group-significance \
  --i-distance-matrix core-metrics-results/weighted_unifrac_distance_matrix.qza \
  --m-metadata-file metadata.tsv \
  --m-metadata-column cage_id \
  --o-visualization core-metrics-results/weighted-unifrac-cage-significance.qzv \
  --p-pairwise
```

可视化结果:

- `core-metrics-results/weighted-unifrac-cage-significance.qzv`: 按笼子统计有权重unifrac距离的显著性。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcore-metrics-results%2Fweighted-unifrac-cage-significance.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/core-metrics-results/weighted-unifrac-cage-significance.qzv)
- `core-metrics-results/unweighted-unifrac-cage-significance.qzv`:  按笼子统计无权重unifrac距离的显著性。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcore-metrics-results%2Funweighted-unifrac-cage-significance.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/core-metrics-results/unweighted-unifrac-cage-significance.qzv)

> 译者注：可以看到很多笼子间就有显著区别，这是一个小鼠实验中很常见的混淆因子，一定要严格注意，防止下错误结论。

> 问题
> 1. 捐赠者有显著影响吗？
> 2. 从元数据中，我们知道笼子C31，C35和C42都是从一个供体移植的小鼠，而笼子C43，C44和C49来自另一个。在C31和C35笼中收集的样本之间的微生物群落是否存在显着差异？ C31和C43之间怎么样？根据捐赠者的箱图，结果是否符合您的预期？

> 答案，我们分别计算了weighted-unifrac和unweighted_unifrac两种距离的结果。我们只在有权重的为例进行解答，两种结果可能不同。
> 1. 结果中P值为0.001，即有显著影响。
> 2. 在C31和C35中无显著差异(q-value = 0.75)，C31与C43中有显著差异(q-value = 0.01)


PERMANOVA的显著差异可以反映组内的差异或组内差异的差异。这意味着我们可能会看到统计上显著的差异，即使它是由一组内的变异引起的。距离箱线图可以帮助给出视觉上的感觉，但是使用统计测试来确认这一点很好。我们可以使用[permdisp](https://www.ncbi.nlm.nih.gov/pubmed/16706913)来帮助排除由于其中一个感兴趣的组中的高度分散（组内方差）而导致的差异。

我们可以指定我们想要在`qiime Diversity beta-group-significance`中使用`--p-method`标志来使用`permdisp`。让我们探讨基`于cage_id`的离散度，以检查笼子相关的差异是否是由于笼内较大差异引起。

```
# 22s
time qiime diversity beta-group-significance \
  --i-distance-matrix core-metrics-results/weighted_unifrac_distance_matrix.qza \
  --m-metadata-file metadata.tsv \
  --m-metadata-column cage_id \
  --o-visualization core-metrics-results/unweighted-unifrac-cage-significance_disp.qzv \
  --p-method permdisp
```

可视化结果:

- `core-metrics-results/unweighted-unifrac-cage-significance_disp.qzv`: 按笼子统计无权重unifrac距离的显著性。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcore-metrics-results%2Funweighted-unifrac-cage-significance_disp.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/core-metrics-results/unweighted-unifrac-cage-significance_disp.qzv)

> 问题：任何一个笼子的方差都有显着差异吗？

我们还可以使用adonis动作来查看多变量模型。 adonis动作使用PERMANOVA检验，但是允许同时检验多种效应（类似于我们之前使用ANOVA对α多样性的多变量效应的方式）。 让我们看看**供体和基因型之间的交集**。

```
# 9s
time qiime diversity adonis \
  --i-distance-matrix core-metrics-results/unweighted_unifrac_distance_matrix.qza \
  --m-metadata-file metadata.tsv \
  --o-visualization core-metrics-results/unweighted_adonis.qzv \
  --p-formula genotype+donor
```

可视化结果:

- `core-metrics-results/unweighted_adonis.qzv`: 供体和基因型交互条件统计无权重unifrac距离的显著性。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcore-metrics-results%2Funweighted_adonis.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/core-metrics-results/unweighted_adonis.qzv)

> 问题：
> 1. 捐赠者有显著影响吗？
> 2. 从元数据中，我们知道笼子C31，C35和C42都是从一个供体移植的小鼠，而笼子C43，C44和C49来自另一个。在C31和C32笼中收集的样本之间的微生物群落是否存在显着差异？ C31和C43之间怎么样？根据捐赠者的箱图，结果是否符合您的预期？
> 3. 如果您在adonis模型中调整供体，您是否保留基因型效应？基因型解释的变异百分比是多少？

> 参考答案：详者注
1. 查看`core-metrics-results/unweighted_adonis.qzv`，其中donor的Pr=0.001，有显著差异；
2. 查看`core-metrics-results/unweighted-unifrac-cage-significance_disp.qzv`，查看`Distances to C31`，发现与C32或C43间无显著差异。
3. 查看`core-metrics-results/unweighted_adonis.qzv`，保留基因型效应是有的。变异百分比为0.04%。

## 物种注释

Taxonomic classification

到目前为止，我们一直在ASV上进行多样性分析；换句话说，我们仅基于在每个样品中观察到的独特序列变体评估了样品之间的相似性。在大多数实验中，我们希望了解微生物类群的存在 - 识别ASV并给它们“命名”。为此，我们将使用`q2-feature-classifier`插件对ASV进行分类。

对于这种分析，我们将使用经过预先训练的朴素贝叶斯机器学习分类器，该分类器经过训练，可以区分99％Greengenes 13_8参考集中的分类群，修剪为V4高变区的250 bp（对应于515F-806R引物） ）。[该分类器](https://doi.org/10.1186/s40168-018-0470-z)通过识别对特定分类群体具有诊断性的k聚体，并使用该信息来预测每个ASV的分类从属关系。我们可以在这里下载预训练的分类器：

下载基于GreenGene13.8的99%聚类序列的V4区训练的分类器，我们在之前[第4节.人体各部位微生物组分析MovingPicture](https://mp.weixin.qq.com/s/c8ZQegtfNBHZRVjjn5Gyrw)中已经下载过。

如果你完成了之前[第4节. 人体各部位微生物组分析MovingPicture](https://mp.weixin.qq.com/s/c8ZQegtfNBHZRVjjn5Gyrw)的练习，可跳过分类器的下载。

```
# 27M，61s
wget -c \
  -O "gg-13-8-99-515-806-nb-classifier.qza" \
  "https://data.qiime2.org/2020.2/common/gg-13-8-99-515-806-nb-classifier.qza"
```

值得注意的是，Naive Bayes分类器在针对扩增特定高变区数据训练时表现最佳。 您可以根据[训练分类器教程](https://docs.qiime2.org/2020.2/tutorials/feature-classifier/)，训练特定于数据集的分类器，或者从[QIIME 2资源页面](https://docs.qiime2.org/2020.2/data-resources/)下载其他数据集的分类器。 分类器可以重复用于一致版本的包，数据库和感兴趣的区域。

```
# 59s
time qiime feature-classifier classify-sklearn \
  --i-reads ./dada2_rep_set.qza \
  --i-classifier ./gg-13-8-99-515-806-nb-classifier.qza \
  --o-classification ./taxonomy.qza
```

**输出对象**:

- `taxonomy.qza`: 物种注释结果。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Ftaxonomy.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/taxonomy.qza)
- `gg-13-8-99-515-806-nb-classifier.qza`: 物种注释结果。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fgg-13-8-99-515-806-nb-classifier.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/gg-13-8-99-515-806-nb-classifier.qza)

接下来可视化物种注释为表，方便查看。

```
qiime metadata tabulate \
  --m-input-file ./taxonomy.qza \
  --o-visualization ./taxonomy.qzv
```

**输出可视化**:

- `taxonomy.qzv`: 物种注释表，包括界、门、纲、目、科、属和种的注释。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Ftaxonomy.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/taxonomy.qzv)

我们还将代表性序列（`FeatureData [Sequence]`）制成表格。 对代表性序列进行制表将允许我们查看分配给标识符的序列，并以NCBI数据库的形式交互式地对序列进行比对查询。

```
qiime feature-table tabulate-seqs \
  --i-data ./dada2_rep_set.qza \
  --o-visualization ./dada2_rep_set.qzv
```

**输出可视化**:

- `dada2_rep_set.qzv`: 代表序列，特征的序列，可blast到NCBI人工挑选注释。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fdada2_rep_set.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/dada2_rep_set.qzv)

> 问题
> 1. 找到该特征，`07f183edd4e4d8aef1dcb2ab24dd7745`。这个序列的分类学注释是什么？这项任务的置信度是多少？
> 
> 2. 有多少功能被归类为`g__Akkermansia`属？
> 
> 3. 使用列表代表序列查找这些功能。如果你对NCBI进行比对，你会得到与q2-feature-classifier相同的分类标识符吗？

你可以通过上面两个结果文件中搜索到问题的答案。

> 注意
> 
> 您可能会注意到某些功能没有分类注释，对于Greengenes数据库，该分配由该级别的空白字符串表示（例如，“g__”）。这些表明Greengenes数据库没有足够的信息来区分该进化枝的成员，这可能是由于数据库中的模糊性，或者因为被测序的基因区域不能提供区分该进化枝成员的分辨率。这与`q2-feature-classifier`无法可靠地将ASV分类到更深层次的情况不同：在这些情况下，将提供不完整的分类字符串。因此，您可能会在数据中看到两种不同类型的“低估分类”：例如，`k__Bacteria; p__Firmicutes; c__Clostridia; o__Clostridiales; f__Christensenellaceae; G__; s__`（Greengenes中缺少属和物种注释）以及`k__Bacteria; p__Firmicutes; c__Clostridia; o__Clostridiales; f__Christensenellaceae`（q2-feature-classifier无法自信地将ASV归类于属级别）。

> 注意
> 
> 您可能还注意到多个ASV具有相同的分类分配。这是正常的 - 独特的ASV不一定映射到独特的分类群！我们可以在条形图中显示每个分类群的频率（如下所述），或使用`q2-taxa`插件根据分类从属关系`折叠collapse `我们的特征表。

## 物种组成柱状图

Taxonomy barchart

由于我们发现该数据集的多样性存在差异，我们可能需要查看这些样本的分类组成。 为了使其可视化，我们将在多样性数据集中构建我们分析的样本的分类条形图。

在此之前，我们将首先筛选掉比我们的稀疏阈值（2000）更少特征的任何样本。 我们可以使用`q2-feature-table`插件和`filter-samples`方法过滤样本。 这让我们可以根据各种标准过滤我们的表格，例如计数（频率，`--p-min-frequency`和`--p-max-frequency`），特征数量（`--p-min-features`和 `--p-max-feature`）或样本元数据（`--p-where`）。 有关更多详细信息和示例，请参阅[过滤教程](https://docs.qiime2.org/2020.2/tutorials/filtering/)。

对于此示例，我们需要过滤掉比稀疏深度更少的序列的样本。

```
time qiime feature-table filter-samples \
  --i-table ./dada2_table.qza \
  --p-min-frequency 2000 \
  --o-filtered-table ./table_2k.qza
```

**输出对象**：

- `table_2k.qza`: 按2000条序列过滤的特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Ftable_2k.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/table_2k.qza)

现在，让我们使用过滤表在每个样本中构建分类法的交互式条形图。

```
time qiime taxa barplot \
  --i-table ./table_2k.qza \
  --i-taxonomy ./taxonomy.qza \
  --m-metadata-file ./metadata.tsv \
  --o-visualization ./taxa_barplot.qzv
```

**输出对象**：

- `taxa_barplot.qzv`: 按2000条序列过滤的特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Ftaxa_barplot.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/taxa_barplot.qzv)

> 问题：
> 
> 可视化2级（门水平）的数据，并按供体分类，然后按基因型分类。 您能否观察到捐献者之间门的一致差异？ 这让你感到惊讶吗？ 为什么或者为什么不？
> 
> 答案：有。hc_1供体有较多Actinobacteria，偶尔有高丰度的Verrucomicrobia；而pd_1中Probacteria较稳定的出现。

## ANCOM差异丰度分析

Differential abundance with ANCOM

许多微生物组研究人员对测试不同样本组中的个体ASV或分类群是否有更多或更少很感兴趣，这被称为差异丰度。微生物组数据使用传统方法对差异丰度进行了若干挑战。微生物群丰度数据本质上是稀疏的（有很多零）和成分（一切都加起来1）。因此，您可能熟悉的传统统计方法（如ANOVA或t检验）不适合进行微生物组数据的差异丰度检验，并导致较高的假阳性率。 ANCOM是一种具有组合意识的替代方案，可以测试差异丰富的功能。如果您不熟悉该技术，那么值得回顾[ANCOM文章](https://www.ncbi.nlm.nih.gov/pubmed/26028277)以更好地理解该方法。

在我们开始之前，我们将过滤掉低丰度/低流行率的ASV。过滤可以提供更好的分辨率，并限制远低于噪声阈值的特征的错误发现率（FDR）惩罚，以适用于统计检验。显示10个计数的特征可能是仅存在于该样本中的真实特征，可能是存在于若干样本中但仅在一个样本中被放大和测序的特征，因为PCR是一个稍微随机的过程，或者它可能是是噪音。我们不可能説，因为过滤低丰度特征，基于特征的分析可能会更好。然而，过滤也会改变样本的组成，进一步破坏关系。这里，**过滤是作为模型，计算效率和统计实用性之间的折衷来执行的**。

```
# 筛选最小频率为50，至少在4个样品中出现的特征，5s
time qiime feature-table filter-features \
  --i-table ./table_2k.qza \
  --p-min-frequency 50 \
  --p-min-samples 4 \
  --o-filtered-table ./table_2k_abund.qza
```

**输出对象**：

- `table_2k_abund.qza`: 按2000条序列过滤的特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Ftable_2k_abund.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/table_2k_abund.qza)

ANCOM从根本上对`FeatureTable[Frequency]`进行操作，其中包含每个样本中的特征频率。 但是，ANCOM不能容忍零（因为组合方法通常使用对数变换或比率，你不能求对数或除以零）。 要从表中删除零，我们将一个伪计数添加到`FeatureTable [Frequency]`对象，在其位置创建一个`FeatureTable[Composition]`。

```
# 5s
time qiime composition add-pseudocount \
  --i-table ./table_2k_abund.qza \
  --o-composition-table ./table2k_abund_comp.qza
```

**输出对象**：

- `table2k_abund_comp.qza`: 按2000条序列过滤的特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Ftable2k_abund_comp.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/table2k_abund_comp.qza)

让我们使用ANCOM检查基于其供体的小鼠是否存在差异，然后检查它们的遗传背景。 该检验将计算采用FDR校正的p <0.05显著不同的ASV对之间的比率数。

```
# 6s
time qiime composition ancom \
  --i-table ./table2k_abund_comp.qza \
  --m-metadata-file ./metadata.tsv \
  --m-metadata-column donor \
  --o-visualization ./ancom_donor.qzv

# 7s
time qiime composition ancom \
  --i-table ./table2k_abund_comp.qza \
  --m-metadata-file ./metadata.tsv \
  --m-metadata-column genotype \
  --o-visualization ./ancom_genotype.qzv
```

**输出可视化**：

- `ancom_genotype.qzv`: 按基因型差异分析的结果。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fancom_genotype.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/ancom_genotype.qzv)
- `ancom_donor.qzv`: 按基因型差异分析的结果。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fancom_donor.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/ancom_donor.qzv)

当您打开ANCOM可视化时，您将在顶部看到一个火山图，它将ANCOM W统计信息与组的CLR（中心对数变换）相关联。 **W统计量是每个单独分类单元已经过的ANCOM子假设的数量，表明该分类单元的相对丰度与W其他分类群的相对丰度的比率被检测到显著不**同（通常FDR调整后的p <0.05）。因为ANCOM中的差异丰度是基于测试之间的比率，所以它不会产生传统的p值。

> 问题
> 
> 打开供体和基因型以及分类可视化对象的ANCOM可视化。

> 1 捐赠者或小鼠基因型之间是否有更多差异丰富的特征？你是否期望这个结果基于beta多样性？
> 2. 捐赠者和基因型是否存在差异丰富的相同特征？
> 3. 两种基因型之间存在多少差异丰富的特征？使用百分位丰度和火山图作为指导，您能否判断它们在野生型或易感小鼠中是否更丰富？
> 4. 根据基因型使用分类法元数据可视化和搜索序列标识符来显示不同的特征。他们属于什么属？


> 参考答案：
> 
> 1. 打开以上两个结果，看到genotype下有3个显著差异特征，供体下有非常多差异特征。因此供体间差异较大，基因型间差异较小。差异的程度和数量，是可以基于beta多样性期望这个结果。
> 2. 判断两者间是否有共有，可以将两者差异的进行Venn图比较，我们在genotype中只有3个差异，数量不多可直接在donor中检索，发现没有共有的特征。
> 3. 基因型间有3个。它们在野生型wild type中更丰富。
> 4. 在`taxonomy.qzv`中检索这3个特征，它们ac5402de1ddf427ab8d2b0a8a0a44f19、79280cea51a6fe8a3432b2f266dd34db、3017f87a3b0f5200ed54eca17eef3cbb分别属于g__Bacteroides、g__Faecalibacterium和末知属

## 下面部分视频教程

https://v.qq.com/x/page/n3007ry9psh.html

视频有广告，清晰度不够高吗？在微信订阅号“**meta-genome**”后台回复“qiime2”获得1080p视频和测试数据下载链接。

## 再次物种分类

**Taxonomic classification again（2020.02版新增内容）**

在尝试物种分类之前，让分类器学习典型动物粪便样本分类情况可以提高分类的准确性。为了提高分类精度，我们就再次对贝叶斯分类器进行训练。幸运的是，演化自[Qiita](https://qiita.ucsd.edu/)的代表性大便样本数据已经在[readytowear collection](https://github.com/BenKaehler/readytowear)可以获得。

假如你感觉这些并不是典型的大便样本数据，你可以用[q2-clawback插件](https://library.qiime2.org/plugins/q2-clawback/7/)加载老鼠和/或人类大便的样本数据。但是我们在这里就不演示这个插件了，因为它需要会花一些时间运行。如果你想了解更多这方面的信息，请参见这个[教程](https://forum.qiime2.org/t/using-q2-clawback-to-assemble-taxonomic-weights/5859)。

首先下载粪便数据，其中包括99% Greengene 13_8 reference数据。

```
# V4区代表序列，8.9M, 23s
wget -c \
  -O "ref_seqs_v4.qza" \
  "https://data.qiime2.org/2020.2/tutorials/pd-mice/ref_seqs_v4.qza"

# 对应物种注释，2.5M, 7s
wget -c \
  -O "ref_tax.qza" \
  "https://data.qiime2.org/2020.2/tutorials/pd-mice/ref_tax.qza"

# 肠道菌群数据表，224k, 1s
wget -c \
  -O "animal_distal_gut.qza" \
  "https://data.qiime2.org/2020.2/tutorials/pd-mice/animal_distal_gut.qza"
```

接下来重新训练分类器，建立考虑已知菌群丰度的分类器：

```
# 7m 37s
time qiime feature-classifier fit-classifier-naive-bayes \
  --i-reference-reads ./ref_seqs_v4.qza \
  --i-reference-taxonomy ./ref_tax.qza \
  --i-class-weight ./animal_distal_gut.qza \
  --o-classifier ./bespoke.qza
```

**输出对象**：

- `ref_seqs_v4.qza`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fref_seqs_v4.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/ref_seqs_v4.qza)
- `animal_distal_gut.qza`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fanimal_distal_gut.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/animal_distal_gut.qza)
- `bespoke.qza`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fbespoke.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/bespoke.qza)
- `ref_tax.qza`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fref_tax.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/ref_tax.qza)

你可以像使用标准分类器的方法使用新的分类器。

```
# 43s
time qiime feature-classifier classify-sklearn \
  --i-reads ./dada2_rep_set.qza \
  --i-classifier ./bespoke.qza \
  --o-classification ./bespoke_taxonomy.qza

# 可视化，6s
time qiime metadata tabulate \
  --m-input-file ./bespoke_taxonomy.qza \
  --o-visualization ./bespoke_taxonomy.qzv
```

**输出对象**：  

- `bespoke_taxonomy.qza`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fbespoke_taxonomy.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/bespoke_taxonomy.qza)

**输出可视化结果**：  
- `bespoke_taxonomy.qzv`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fbespoke_taxonomy.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/bespoke_taxonomy.qzv)

**问题**：打开老的可视化工具`taxonomy.qzv`，然后与`bespoke_taxonomy.qzv`比较看看有何差异。⑴ 你可以用“ovatus”搜索，能在新的分类学中找到这个ASV吗？这个在原来分类中并没有出现。⑵ 重新查阅`ancom_donor.qzv`可视化结果，你能发现这个ASV吗？

在分析ANCOM结果时，我们可以追踪这些用前面创建的分类法发现的ASVs。在我们自己的样品中，通过根据物种分类特征进行计数可获得分类群组；然后我们也可以直接在这些分类群组上直接运行ANCOM。这种在分类学上具有相似性的ASVs间汇集特征计数的方法具有一定优势，比如它允许在样品间进行精确的物种替换，这种输出结果也具有比较强的可读性。不过它也有不足之处，即它同样存在来自物种分类不精确性带来的问题。

为了便于比较，我们将运行这个流程二次，一次用原来的分类信息，一次用新的分类注释信息。首先用原来的分类信息：

```
# 4s
time qiime taxa collapse \
  --i-table ./table_2k.qza \
  --i-taxonomy ./taxonomy.qza \
  --o-collapsed-table ./uniform_table.qza \
  --p-level 7 # means that we group at species level

# 5s
time qiime feature-table filter-features \
  --i-table ./uniform_table.qza \
  --p-min-frequency 50 \
  --p-min-samples 4 \
  --o-filtered-table ./filtered_uniform_table.qza

# 5s
time qiime composition add-pseudocount \
  --i-table ./filtered_uniform_table.qza \
  --o-composition-table ./cfu_table.qza

# 6s
time qiime composition ancom \
  --i-table ./cfu_table.qza \
  --m-metadata-file ./metadata.tsv \
  --m-metadata-column donor \
  --o-visualization ./ancom_donor_uniform.qzv
```

**输出对象**:

- `uniform_table.qza`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Funiform_table.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/uniform_table.qza)
- `cfu_table.qza`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcfu_table.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/cfu_table.qza)
- `filtered_uniform_table.qza`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Ffiltered_uniform_table.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/filtered_uniform_table.qza)

**输出可视化结果**：ancom_donor_uniform.qzv: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fancom_donor_uniform.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/ancom_donor_uniform.qzv)

下面用新的分类学再来运行一次：

```
qiime taxa collapse \
  --i-table ./table_2k.qza \
  --i-taxonomy ./bespoke_taxonomy.qza \
  --p-level 7 \
  --o-collapsed-table ./bespoke_table.qza

qiime feature-table filter-features \
  --i-table ./bespoke_table.qza \
  --p-min-frequency 50 \
  --p-min-samples 4 \
  --o-filtered-table ./filtered_bespoke_table.qza

qiime composition add-pseudocount \
  --i-table ./filtered_bespoke_table.qza \
  --o-composition-table ./cfb_table.qza

qiime composition ancom \
  --i-table ./cfb_table.qza \
  --m-metadata-file ./metadata.tsv \
  --m-metadata-column donor \
  --o-visualization ./ancom_donor_bespoke.qzv
```

**输出对象**：

- `bespoke_table.qza`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fbespoke_table.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/bespoke_table.qza)
- `cfb_table.qza`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcfb_table.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/cfb_table.qza)
- `filtered_bespoke_table.qza`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Ffiltered_bespoke_table.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/filtered_bespoke_table.qza)

**输出可视化结果**：  
- `ancom_donor_bespoke.qzv`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fancom_donor_bespoke.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/ancom_donor_bespoke.qzv)

**问题**：比较最终的ANCOM可视化结果，其实他们是很像的，你觉得哪个更好呢？问题⑴：在ANCOM结果中出现的Bacteroides ovatus是来自于原来的分类法吗？问题⑵：B. ovatus有没有出现在新的ANCOM结果中？问题⑶：这是为什么？

## 纵向分析

**Longitudinal analysis**

该研究包括纵向分量;在粪便移植后7,14,21和49天收集每只小鼠的样品。我们可以使用`q2-longitudinal`插件来探索小鼠遗传背景影响每只小鼠微生物群落变化的假设。对于这种纵向分析，我们将重点关注beta多样性。婴儿的α多样性变化很大，但在短时间内成人常常稳定。我们在相对较短的时间内处理成人粪便群落，并且α多样性随时间没有差异。[纵向分析教程](https://docs.qiime2.org/2020.2/tutorials/longitudinal/)是探索微生物组样本纵向分析的极好资源。

### 基于PCoA的分析

PCoA-based analyses

我们可以从使用动画animations选项卡探索PCoA中的时间变化开始。

**问题**

1. 打开未加权的UniFrac emperor 图[查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fcore-metrics-results%2Funweighted_unifrac_emperor.qzv)，并设置样本按小鼠ID(`mouse_id`)着色。单击“动画Animations”选项卡并使用`day_post_transplant`作为渐变(Gradient)和mouse_id作为轨迹(Trajectory)进行动画处理。您是否观察到基于PCoA的任何明确的时间趋势？(打开weighted_unifrac_emperor.qzv文件，自己操作一下，很有意思)
2. 如果你通过`day_post_transplant`上色会发生什么？您是否看到了当天的差异？提示：尝试将色彩映射更改为像viridis一样的连续色彩映射。


波动率图(**volatility plot**)将让我们从同一点开始查看沿主要坐标轴的变化模式。这可能很有用，因为个体间的变化可能很大，而这种可视化使我们可以专注于每个群体和每个人的变化幅度。

让我们使用`q2-longitudinal`插件来查看来自个人的样本如何沿每个主坐标(PC)移动。 `-m-metadata-file`列可以采用多种类型，包括元数据文件（如`metadata.tsv`）以及`SampleData [AlphaDiversity]`，`SampleData [Distance]`（“可查看”文件作为元数据）或`PCoA`对象。

```
# 24s，绘制波动率图，输入元数据，非权重unifrac的pcoa结果，指定状态列为时间，个体列为小鼠，分组列为供体状态，默认数值来自第二轴，输出pc_vol.qzv
time qiime longitudinal volatility \
  --m-metadata-file ./metadata.tsv \
  --m-metadata-file ./core-metrics-results/unweighted_unifrac_pcoa_results.qza \
  --p-state-column days_post_transplant \
  --p-individual-id-column mouse_id \
  --p-default-group-column 'donor_status' \
  --p-default-metric 'Axis 2' \
  --o-visualization ./pc_vol.qzv
```

**输出可视化**：

- `pc_vol.qzv`: 按主坐标轴值和时间的波动图。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fpc_vol.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/pc_vol.qzv)

> 问题：使用右侧控件，查看PC 1,2和3中笼子的变化。沿着每个轴，您看到了什么样的图案？

> 答：主要在第一轴上，笼分成两组且明显分开，而且与供与分组一致。

### 基于距离的分析

Distance-based analysis

现在，让我们试着直接查看样本之间的成对距离。在这里，我们将检验这样的**假设，基因型会影响从每只小鼠收集的样本至第一个样本（移植后7天）的距离变化幅度**。我们**假设，鉴于微生物群落的动态变化率，可能会看到群落随着时间的推移而发生变化。我们将回答这些变化是否与宿主基因型相关**。

我们将通过观察每只小鼠的微生物群落从移植后7天的变化开始这一分析。我们使用`baseline`参数指定一个静态时间点，与之比较所有其他时间点; 如果我们从命令中删除此参数，我们会查看每个时间点之间每个人的变化率。有关详细信息，请参阅[纵向分析教程](https://docs.qiime2.org/2020.2/tutorials/longitudinal/)。

```
# 纵向分析，5s
time qiime longitudinal first-distances \
  --i-distance-matrix ./core-metrics-results/unweighted_unifrac_distance_matrix.qza \
  --m-metadata-file ./metadata.tsv \
  --p-state-column days_post_transplant \
  --p-individual-id-column mouse_id \
  --p-baseline 7 \
  --o-first-distances ./from_first_unifrac.qza
```

**输出对象**：

- `from_first_unifrac.qza`: 基于无权重unifrac距离的时间分析。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Ffrom_first_unifrac.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/from_first_unifrac.qza)

我们可以再次使用波动率分析来根据距离可视化β多样性的变化。

```
# 5s，可视化基线距离
time qiime longitudinal volatility \
  --m-metadata-file ./metadata.tsv \
  --m-metadata-file ./from_first_unifrac.qza \
  --p-state-column days_post_transplant \
  --p-individual-id-column mouse_id \
  --p-default-metric Distance \
  --p-default-group-column 'donor_status' \
  --o-visualization ./from_first_unifrac_vol.qzv
```

**输出可视化**：

- `from_first_unifrac_vol.qzv`: 基于无权重unifrac距离的时间分析图表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Ffrom_first_unifrac_vol.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/from_first_unifrac_vol.qzv)

> 问题：根据波动率图，一个捐赠者的变化是否会随着时间的推移而变化？基因型怎么样？笼子怎么变？
> 答：切换不同分组方式`donor_status`、`genotype`和`cage_id`查看，你会看到三种不同的变化趋势，自己总结一下吧。

**线性混合效应（linear mixed effects, LME）模型允许我们检验在使用重复测量的实验中因变量和一个或多个自变量之间是否存在关系**。由于我们对基因型感兴趣，我们应该将其作为一个独立的预测因子。

对于我们的实验，我们目前**对距离初始时间点的距离变化感兴趣**，因此我们将其用作结果变量（由`--p-metric`给出）。

线性混合效果`linear-mixed-effects`分析还需要一个状态列（`--p-state-column`），它指定元数据中的时间组件，以及一个单独的标识符（`--p-individual-id-column`）。我们应该在数据中使用哪些列？

我们可以使用`--p-formula`参数或`--p-group-columns`参数构建模型。对于这种分析，我们**对基因型是否影响微生物群落的纵向变化感兴趣**。然而，我们从横断面分析中也知道，捐赠者在塑造粪便群落方面发挥着重要作用。因此，我们也应该在此分析中包括这一点。我们可能还想在我们的实验中考虑笼子效应，因为这是啮齿动物研究中常见的混淆因素。然而，这里最初的实验设计很聪明：**虽然笼子按供体分组（小鼠是粪便），但它们是混合基因型。这种部分随机化有助于限制我们可能看到的一些笼子效应**。

根据实验设计，我们应该选择哪些组列？

```
# 混线模型分析，分析至7点的距离，考虑基因型和供体11s
time qiime longitudinal linear-mixed-effects \
  --m-metadata-file ./metadata.tsv \
  --m-metadata-file ./from_first_unifrac.qza \
  --p-metric Distance \
  --p-state-column days_post_transplant \
  --p-individual-id-column mouse_id \
  --p-group-columns genotype,donor \
  --o-visualization ./from_first_unifrac_lme.qzv
```

**输出可视化**：

- `from_first_unifrac_lme.qzv`: 基于无权重unifrac距离的交互时间分析。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Ffrom_first_unifrac_lme.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/from_first_unifrac_lme.qzv)

现在，让我们看一下模型的结果。

> **问题**
> 
> 1. 基因型和时间变化之间是否存在显著关联？
> 2. 哪种基因型更稳定（变异较小）？
> 3. 与捐赠者有关的时间变化吗？您是否根据波动率结果预期或不期望这一点？
> 4. 你能找到供体和基因型之间的相互作用吗？

> 详者注：参考答案。
> 
> 1. 是；
> 2. 易感型，看第一张图。
> 3. 有，疾病更稳定，健康变化大；与波动图结果一致，可预期此结果；
> 4. 能找到，且存在显著关联。

> 注意
> 
> 重要的是，LME模型还允许我们区分两种类型的独立变量：**固定效应（例如，实验处理）和随机效应（例如，在实验中不能控制的生物因子）**。默认情况下，`q2-longitudinal`中的线性混合效应`linear-mixed-effects`动作使用`individual_id_column`作为随机效应，因为我们可以预期各个主体之间的生物差异将影响我们正在测试的因变量的基线值(baseline values)。变化率-斜率——是另一种个体间效应(The rate of change — slope — is another inter-individual effect)，我们通常可能希望将其视为纵向实验中的随机效应。有关LME测试和效果类型的更多详细信息和讨论，请参阅[纵向分析教程](https://docs.qiime2.org/2020.2/tutorials/longitudinal/)。

## 用于预测样本特征的机器学习分类器

Machine-learning classifiers for predicting sample characteristics

作为在本教程中用于测试样本是否以及如何区分彼此不同的替代（或补充）方法，我们可以利用机器学习方法来确定预测性微生物组成与样本的其他特征的关系。例如，我们可以使用机器学习分类器来**预测患者对疾病的易感性，或预测样本所属的实验组**。此外，许多机器学习方法报告**哪些特征对于预测样本特征是最重要的，使其确定哪些特征（ASV，物种等）与特定治疗、疾病状态或其他感兴趣类别相关联**的有用方法。所有这些以及更多内容都可以在`q2-sample-classifier`插件中找到。在这里，我们将使用此插件根据其ASV组成使用随机森林分类器预测每个小鼠的基因型和供体状态（此流程可通过估算器`estimator`参数访问许多不同的机器学习方法，但默认情况下使用随机森林分类器`Random Forest classifiers`）。

```
# 随机森林分类：基因型和供体组合，8s
time qiime sample-classifier classify-samples \
  --i-table ./dada2_table.qza \
  --m-metadata-file ./metadata.tsv \
  --m-metadata-column genotype_and_donor_status \
  --p-random-state 666 \
  --p-n-jobs 1 \
  --output-dir ./sample-classifier-results/
```

**输出对象**：

- `sample-classifier-results/probabilities.qza`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fsample-classifier-results%2Fprobabilities.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/sample-classifier-results/probabilities.qza)
- `sample-classifier-results/sample_estimator.qza`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fsample-classifier-results%2Fsample_estimator.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/sample-classifier-results/sample_estimator.qza)
- `sample-classifier-results/feature_importance.qza`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fsample-classifier-results%2Ffeature_importance.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/sample-classifier-results/feature_importance.qza)
- `sample-classifier-results/predictions.qza`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fsample-classifier-results%2Fpredictions.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/sample-classifier-results/predictions.qza)

**输出可视化**：

- `sample-classifier-results/accuracy_results.qzv`: 模型准确度评估混淆矩阵和ROC曲线。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fsample-classifier-results%2Faccuracy_results.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/sample-classifier-results/accuracy_results.qzv)
- `sample-classifier-results/model_summary.qzv`: 模型摘要。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fsample-classifier-results%2Fmodel_summary.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/sample-classifier-results/model_summary.qzv)

此流程生成许多输出对象和可视化。您可以在示例分类器教程中阅读有关这些内容的更多信息，但现在让我们只关注`./sample-classifier-results/accuracy_results.qzv`。此可视化通过[`混淆矩阵(confusion matrix)`](https://en.wikipedia.org/wiki/Confusion_matrix)和附带的准确度分数表告诉您样本分类器的执行情况。这会告诉您每个样本类型分类到每个样本类的频率，包括正确的类标签。整体错误率也在下表中报告。

> 问题：我们怎么操作？只是为了好玩，尝试预测一些其他元数据列，以查看可以轻松预测cage_id和其他列。

> 详者注：参考答案，见下方代码。

```
# 随机森林分类：预测笼子，11s
time qiime sample-classifier classify-samples \
  --i-table ./dada2_table.qza \
  --m-metadata-file ./metadata.tsv \
  --m-metadata-column cage_id \
  --p-random-state 666 \
  --p-n-jobs 1 \
  --output-dir ./sample-classifier-cage_id/
# 同样查看输出目录中的accuracy_result.qzv，准确率60%，高于基线3倍

# 随机森林分类：预测供体分类，12s
time qiime sample-classifier classify-samples \
  --i-table ./dada2_table.qza \
  --m-metadata-file ./metadata.tsv \
  --m-metadata-column donor \
  --p-random-state 666 \
  --p-n-jobs 1 \
  --output-dir ./sample-classifier_donor/
# 准备率100%
```

看起来我们做得很好！因此，我们可以看到**哪些特征对每个样本类（供体和基因型组）最具预测性**。重要性分数存储在`./sample-classifier-results/feature_importance.qza`对象中（专业提示：这可以使用前面介绍的`qiime metadata tabulate`命令进行查看）。

在这里，我们将生成一个热图，显示每个基因型和供体组中100个最重要的ASV的平均丰度。

注：此处的参数有更新，`metadata-file`全变为`sample-metadata-file`。因为metadata还有feature-metadata。

```
# 25s
time qiime sample-classifier heatmap \
  --i-table ./dada2_table.qza \
  --i-importance ./sample-classifier-results/feature_importance.qza \
  --m-sample-metadata-file ./metadata.tsv \
  --m-sample-metadata-column genotype_and_donor_status \
  --p-group-samples \
  --p-feature-count 100 \
  --o-heatmap ./sample-classifier-results/heatmap.qzv \
  --o-filtered-table ./sample-classifier-results/filtered-table.qza
```

**输出对象**：

- `sample-classifier-results/probabilities.qza`: [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fsample-classifier-results%2Ffiltered-table.qza) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/sample-classifier-results/filtered-table.qza)

**输出可视化**：

- `sample-classifier-results/heatmap.qzv`: 样本按组均值取log10对数的特征热图。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.2%2Fdata%2Ftutorials%2Fpd-mice%2Fsample-classifier-results%2Fheatmap.qzv) | [下载](https://docs.qiime2.org/2020.2/data/tutorials/pd-mice/sample-classifier-results/heatmap.qzv)

> 问题：哪些特征可以区分基因型genotypes呢？捐助者呢donors？ 哪些ASV是否特定于单个样品组？

> 详者注：参考答案，wild type组相近，而suspectible不同的特征；同理Healthy与PD不同的。每组特异的。


## 合成

Synthesis

根据分析结果，我们可以说这些小鼠的微生物群落基于其供体和遗传背景存在差异。 （这概括了原始分析的结果。）

我们发现捐赠者是α多样性的主要驱动因素。

但是，我们看到基于β多样性的供体和基因型的差异。使用PCoA emperor 图，我们可以看到两个捐赠者的小鼠之间的差异明显。在调整为供体后，我们发现基因型之间存在显著差异。

虽然捐赠者或基因型之间的诊断图中的条形图没有明确的模式，但我们仍然能够找到使用ANCOM和随机森林分类区分基因型的ASV。这些ASV在供体和遗传背景中没有重叠，支持这样的假设，即基因型的差异与供体的差异是分开的。

波动率图和时间分析表明，不同遗传背景下的微生物组随着时间的推移发生了不同的变化。

这表明对接受粪菌移植的小鼠的微生物组具有基因型特异性作用。

💩🐁


## Reference

https://docs.qiime2.org/2020.2

Evan Bolyen*, Jai Ram Rideout*, Matthew R. Dillon*, Nicholas A. Bokulich*, Christian C. Abnet, Gabriel A. Al-Ghalith, Harriet Alexander, Eric J. Alm, Manimozhiyan Arumugam, Francesco Asnicar, Yang Bai, Jordan E. Bisanz, Kyle Bittinger, Asker Brejnrod, Colin J. Brislawn, C. Titus Brown, Benjamin J. Callahan, Andrés Mauricio Caraballo-Rodríguez, John Chase, Emily K. Cope, Ricardo Da Silva, Christian Diener, Pieter C. Dorrestein, Gavin M. Douglas, Daniel M. Durall, Claire Duvallet, Christian F. Edwardson, Madeleine Ernst, Mehrbod Estaki, Jennifer Fouquier, Julia M. Gauglitz, Sean M. Gibbons, Deanna L. Gibson, Antonio Gonzalez, Kestrel Gorlick, Jiarong Guo, Benjamin Hillmann, Susan Holmes, Hannes Holste, Curtis Huttenhower, Gavin A. Huttley, Stefan Janssen, Alan K. Jarmusch, Lingjing Jiang, Benjamin D. Kaehler, Kyo Bin Kang, Christopher R. Keefe, Paul Keim, Scott T. Kelley, Dan Knights, Irina Koester, Tomasz Kosciolek, Jorden Kreps, Morgan G. I. Langille, Joslynn Lee, Ruth Ley, **Yong-Xin Liu**, Erikka Loftfield, Catherine Lozupone, Massoud Maher, Clarisse Marotz, Bryan D. Martin, Daniel McDonald, Lauren J. McIver, Alexey V. Melnik, Jessica L. Metcalf, Sydney C. Morgan, Jamie T. Morton, Ahmad Turan Naimey, Jose A. Navas-Molina, Louis Felix Nothias, Stephanie B. Orchanian, Talima Pearson, Samuel L. Peoples, Daniel Petras, Mary Lai Preuss, Elmar Pruesse, Lasse Buur Rasmussen, Adam Rivers, Michael S. Robeson, Patrick Rosenthal, Nicola Segata, Michael Shaffer, Arron Shiffer, Rashmi Sinha, Se Jin Song, John R. Spear, Austin D. Swafford, Luke R. Thompson, Pedro J. Torres, Pauline Trinh, Anupriya Tripathi, Peter J. Turnbaugh, Sabah Ul-Hasan, Justin J. J. van der Hooft, Fernando Vargas, Yoshiki Vázquez-Baeza, Emily Vogtmann, Max von Hippel, William Walters, Yunhu Wan, Mingxun Wang, Jonathan Warren, Kyle C. Weber, Charles H. D. Williamson, Amy D. Willis, Zhenjiang Zech Xu, Jesse R. Zaneveld, Yilong Zhang, Qiyun Zhu, Rob Knight & J. Gregory Caporaso#. Reproducible, interactive, scalable and extensible microbiome data science using QIIME 2. ***Nature Biotechnology***. 2019, 37: 852-857. doi:[10.1038/s41587-019-0209-9](https://doi.org/10.1038/s41587-019-0209-9)

Timothy R. Sampson, Justine W. Debelius, Taren Thron, Stefan Janssen, Gauri G. Shastri, Zehra Esra Ilhan, Collin Challis, Catherine E. Schretter, Sandra Rocha, Viviana Gradinaru, Marie-Francoise Chesselet, Ali Keshavarzian, Kathleen M. Shannon, Rosa Krajmalnik-Brown, Pernilla Wittung-Stafshede, Rob Knight & Sarkis K. Mazmanian. Gut Microbiota Regulate Motor Deficits and Neuroinflammation in a Model of Parkinson's Disease. ***Cell*** 167, 1469-1480.e1412, doi:10.1016/j.cell.2016.11.018 (2016).

Nearing JT, Douglas GM, Comeau AM, Langille MGI. 2018. Denoising the Denoisers: an independent evaluation of microbiome sequence error-correction approaches. ***PeerJ*** 6:e5364 https://doi.org/10.7717/peerj.5364


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