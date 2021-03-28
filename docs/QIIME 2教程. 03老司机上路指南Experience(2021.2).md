[TOC]

# 老司机上路指南

**QIIME 2 for Experienced Microbiome Researchers**

https://docs.qiime2.org/2021.2/tutorials/qiime2-for-experienced-microbiome-researchers/

正文共：7000 字 0 图 1 视频

预计阅读时间： 17 分钟，视频时长 14 分钟

更新时间：2021年3月16日

本节我们将介绍如何使用QIIME 2处理微生物数据。本节教程主要针对经验丰富的微生物研究人员，即已经对如何处理数据非常熟悉，**只需要知道的QIIME 2中特殊步骤的命令**。

上一节我们的[QIIME 2概述教程包含微生物数据处理的更多理论](https://mp.weixin.qq.com/s/3l0qcM27VstkyZOjlmBjfQ)，本节将使老司机轻松上手QIIME 2。新人可跳过，或当学习资料阅读(看看是否能读懂，全看懂的就是真正的老司机)。

## 本节视频视频教程

http://v.qq.com/x/page/q0914ymuebg.html

视频有广告，清晰度不够高吗？**在微信订阅号“宏基因组(meta-genome)”后台回复“qiime2”获得1080p视频和测试数据下载链接**。

## 为什么要改用QIIME 2?

**Why switch to QIIME 2?**

对于习惯于使用自己的工具和脚本处理数据、并且希望对过程中的每个步骤进行精细控制的用户来说，转换到QIIME 2可能是困难的(这好像是在説我)。我们理解经验丰富的微生物研究人员令人抓狂的学习曲线，但是相信社区、开源的环境和对可重复科学的承诺，使得切换到QIIME 2时开始感觉有些沮丧是值得的(科研不是向来如此吗？没有苦哪来甜，幸福也是比较出来的)。

通过为微生物组数据分析提供一个通用框架，QIIME 2汇集了一个充满活力的和包容性的社区。通过加入QIIME 2社区，作为一名正式的微生物学研究人员，您将自动与该领域的其他领导者产生联系，并且能够更容易地一起工作，以推动微生物学研究的最佳方法的开发和实施，以供广泛使用。QIIME 2社区包括微生物学研究的老司机以及新手：鼓励所有人参与并相互学习。[QIIME 2论坛](https://forum.qiime2.org/)包含关于如何执行微生物数据处理和分析的大量信息，以及关于该领域最佳方法具有建设意义的讨论。

QIIME 2还鼓励使**微生物学研究分析可重复**。QIIME 2通过定义特定的数据类型和仅将方法限制到其适当的数据输入类型，以减少不适当的分析。它还自动记录每个QIIME 2对象相关联的数据起源和对给定数据文件所做的所有操作。

此外，通过将工具封装到一个常用框架中，形成了简化的**数据处理流程**。使用QIIME 2大多数数据处理工作流可以合并成一个（或几个）bash脚本，从而减少需要调用的不同程序或可执行文件的数量以及需要重新格式化数据步骤的数量。

最后，**QIIME 2是开源的，有经验的研究人员可贡献个人的代码，以扩大本软件的使用范围**。任何工具都可以作为插件添加到QIIME 2中，它可以为任何软件、包或其他可安装、可执行文件提供接口。为自己开发的方法编写QIIME 2插件，使得成千上万的用户立即访问并使用它。

### 老司机上路前的几点建议

**Pro-tips for power users**

以下是我们学到的一些技巧，这些经验将有助于您将工作流程转变为QIIME 2：

**提示1: QIIME 2对象只是zip文件**。如果您想查看`.qza`对象中的文件，可以使用[qiime导出工具](https://docs.qiime2.org/2021.2/tutorials/exporting/)来提取数据文件（它基本上只是用于解压缩的工具）。或者，您也可以直接解压缩对象（`unzip -k file.qza`）并查看数据/文件夹中的文件。

**提示2：QIIME 2命令行接口工具运行速度较慢，因为它每次调用对象时都必须解压缩和重新压缩对象中包含的数据**。如果需要更多交互地处理数据，您可能希望使用Python API——它更快，因为对象可以简单地存储在内存中。您可以了解更多关于QIIME 2界面版的信息。

## 数据处理步骤

**Data processing steps**

本教程中将介绍的处理步骤包括：

1. 将原始序列（FASTQ）数据导入QIIME 2
2. 数据样本拆分（即，将每个序列分配至它来源的样本），去除序列中非生物部分(如标签和引物)
3. 执行质量控制：
    1. 使用有`DADA2`或`deblur`的去噪序列，和/或
    2. 使用`VSEARCH`或`dbOTU`进行质量筛选、长度剪切和聚类
4. 物种分类
5. 分析数据并获得生物学意义！
6. 分析并深入了解数据

[教程概述](https://docs.qiime2.org/2021.2/tutorials/overview/)和[可用插件列表](https://docs.qiime2.org/2021.2/plugins/available/)可以为其他可能的处理和分析步骤提供思路。

### 数据导入

**Importing data into QIIME 2**

相关插件：`qiime tools import`

如果使用QIIME 2处理数据，则首先需要将该数据转换成QIIME 2能够识别的格式。QIIME 2中当前可用的各种导入方法在[QIIME 2导入教程](https://docs.qiime2.org/2021.2/tutorials/importing/)章节中重点介绍。

这个步骤可能是QIIME 2分析流程中最令人困惑的部分，因为有许多导入和格式类型可供选择。要查看可用导入/格式类型的完整列表，请使用：`qiime tools import --show-importable-formats`(见附录1)和`qiime tools import --show-importable-types`(见附录2)。

```
# 如果你conda添加环境变量，但无法启动，可以手动更新bash环境变量
source ~/.bashrc
# 启动conda的QIIME2环境
conda activate qiime2-2019.7

# 显示可用导入的格式
qiime tools import --show-importable-formats

# 显示可用导入的类型
qiime tools import --show-importable-types
# 结果较长，详见附录
```

如果导入FASTQ数据，你需要manifest file，这是一个纯文本文件，主要作用是告诉软件每个FASTQ数据的样本名和序列方向。假设你导入的数据是双端序列，那么manifest file一般有3列，分别是样本id、文件名和序列方向。例如：

sample-id,filename,direction </br>
sample01,sample01_S1_L001_R1_001.fastq.gz,forward </br>
sample01,sample01_S1_L001_R2_001.fastq.gz,reverse </br>

如果你的数据是两种非常特殊的格式（[EMP](https://docs.qiime2.org/2021.2/tutorials/importing/#emp-import)或[Casava](https://docs.qiime2.org/2021.2/tutorials/importing/#casava-import)之一的序列数据，则可以直接导入包含序列文件的文件夹，方法为`--type EMPSingleEndSequences`或`--type 'SampleData[PairedEndSequencesWithQuality]'`（或其相应的双端类型）。否则，如果您没有这两种非常特定的格式之一，则需要制作清单文件以给出关于导入什么和如何导入文件的导入指令。

如果希望直接导入FASTA文件或特征表，也可以使用不同`--type`的标志或`qiime tools import`。[导入教程](https://docs.qiime2.org/2021.2/tutorials/importing/)详细介绍了所有这些选项的详细信息。

### 样本拆分

**Demultiplexing sequences**

相关插件

- [q2-demux](https://docs.qiime2.org/2021.2/plugins/available/demux/)
- [cutadapt](https://docs.qiime2.org/2021.2/plugins/available/cutadapt/)

如果在同一个文件中包含了多个样本，则需要对序列进样本拆分。

如果您的条形码（barcodes）已经从序列中移除，并且位于单独的文件中，则可以使用`q2-demux`对这些条形码进行样本拆分。

如果你的条形码还在序列中，你可以使用cutadapt插件的函数。`cutadap demux-single`方法在序列的开始（或5’末端）查找具有特异容错性的条形码序列，删除它们并返回由每个样本单独的序列数据。QIIME 2论坛上有关于`cutadapt`中[各种功能的教程，包括样本拆分](https://forum.qiime2.org/t/demultiplexing-and-trimming-adapters-from-reads-with-q2-cutadapt/2313)。通过阅读这些文档，你可以了解更多关于`cutadapt`如何工作的。

注意：目前`q2-demux`和`q2-cutadapt`不支持双端条码的样品拆分，而且只能在正向序列中查找条码并进行拆分。因此，目前这种类型的样本拆分需要使用其他工具（例如bcl2fastq）在QIIME 2之外完成。

### 双端合并

**Merging reads**

相关插件：[`q2-vsearch`](https://docs.qiime2.org/2021.2/plugins/available/vsearch/)

是否需要合并序列取决于你计划如何将序列聚类或去噪为扩增序列变体（ASV）或操作分类单元（OTU）。如果接下来打算**使用deblur或OTU聚类方法，现在就合并序列**。如果计划使用**dada2对序列进行去噪，则不要合并**——dada2会在对每个序列进行去噪之后自动执行序列合并。

如果需要合并序列，可以使用QIIME 2 `q2-vsearch`插件的`join-pairs`方法。

### 去除非生物序列

**Removing non-biological sequences**

相关插件

- [q2-cutadapt](https://docs.qiime2.org/2021.2/plugins/available/cutadapt/)
- [dada2](https://docs.qiime2.org/2021.2/plugins/available/dada2/)

如果您的数据包含任何非生物序列（例如，引物、测序接头、PCR间隔区等），则应该删除这些序列。

`q2-cutadapt`插件具有从成对或单端数据中去除非生物序列的多种方法。

如果要使用DADA2对序列进行去噪，可以在调用去噪函数的同时删除非生物序列。DADA2的所有去噪函数都具有某种`--p-trim`参数，您可以指定该参数来从序列的5'末端删除碱基。（Deblur没有这个功能。）

### 相似序列分组

**Grouping similar sequences**

将相似序列分组主要有两种方法：去噪和聚类。上一节[概述教程](https://docs.qiime2.org/2021.2/tutorials/overview/#denoising)提供了对这些方法更深入的讨论。

无论如何对序列进行分组，分组方法将输出：

1. 每个OTU和/或ASV的代表序列（QIIME 2数据格式`FeatureData[Sequence]`）
2. 一个特征表，它指示每个样本中每个OTU/ASV的测序次数。(QIIME 2数据格式特征表[频率]`FeatureTable[Frequency]`)

DADA2和deblur还将生成一个带有关于过滤和去噪的相关信息的统计摘要文件。

### 去噪

**Denoising**

相关插件：

- [dada2](https://docs.qiime2.org/2021.2/plugins/available/dada2/)
- [deblur](https://docs.qiime2.org/2021.2/plugins/available/deblur/)

DADA2和deblur是目前QIIME 2中可用的两种去噪方法。您可以在概述教程中了解更多关于这些方法的信息。

DADA2和deblur都输出精确的序列变体（exact sequence variants，ESV），据推测这些变体更能代表存在于数据中的真实生物序列。它们的创建者对于这些序列有不同的名称（DADA2称它们为“扩增序列变体”（ASV），deblur称它们为“subOTU”，unoise称为Zotu）。我们将在本教程中使用ASV术语来统一代表这些种类的输出。

**准备去噪数据 Preparing data for denoising**

去噪只需要很少的数据准备。DADA2和deblur都执行质量过滤、去噪和嵌合体去除，因此在运行它们之前不应该执行任何质量筛选。deblur开发人员建议在使用deblur之前使用默认设置进行[初始质量筛选](https://docs.qiime2.org/2021.2/tutorials/moving-pictures/#moving-pictures-deblur)（如“人体不同部分微生物组”教程所示）。DADA2内置了基于Q值的过滤，因此在用DADA2进行去噪之前执行这个质量过滤步骤是不必要的。

两种方法都具有将序列截断为恒定长度（在降噪之前发生）的选项。在DADA2中，这是`–p-trunc-len`参数；在deblur中，它是`–p-trim-length`。截断参数对于DADA2和deblur都是可选的（但是如果使用deblur，则需要指定`–p-trim-length -1`来禁用截断）。比截断长度短的读被丢弃，而比截断长度长的序列在指定位置被截断。概览教程中有更多关于决定截断到什么长度的讨论。

**使用DADA2去噪 Denoising with DADA2**

[DADA2插件](https://docs.qiime2.org/2021.2/plugins/available/dada2/)有多种方法进行序列去噪：

- 去噪双端序列(denoise paired-end)，要求未合并的双端序列（即包括正向和反向序列）。
- 去噪单端序列(denoise single-end)，需要单端或合并的双端数据。如果向其提供未合并的成对端数据，则它将只使用正向序列（而对反向序列不做任何操作）。
- 去噪-焦磷酸测序，可**接受 ion torrent 测序仪的数据**。

注意，对于**非常大的数据集，DADA2可能非常慢**。可以通过增加`--p-n-threads`参数**使用多线程缩短计算时间**(前提是你的系统有足够多的线程)。

**deblur去噪**

deblur 插件具有两种序列去噪的方法：

- `deblur-16S` 对16S序列进行去噪。
- `deblur-other` 去噪其他类型的序列。

如果使用`deblur-16S`，deblur执行初始的正向过滤步骤，其中**它丢弃与85%  GreenGenes 数据库中OTU的序列小于60%相似性的任何序列。如果不想执行此步骤，请使用`deblur-other`方法**。

deblur目前只能对单端序列进行去噪。如果提供末合并的双端序列为输入，将对反向序列不作任何操作。请注意，deblur接受合并的序列，并将它们视为单端序列，因此如果**使用deblur进行去噪，需要先合并双端读长**。

### OTU聚类

**OTU Clustering**

在本教程中，我们将涉及QIIME 2的无参(de novo)和有参(closed reference)两类聚类方法。[QIIME OTU聚类教程](https://docs.qiime2.org/2021.2/tutorials/otu-clustering/)部分有更多的细节。

对序列进行聚类，你需要确保：

- 双端序列已经合并
- 非生物序列已经去除(如引物)
- 序列截取为相同的长度
- 低质量序列已经去除

我们讨论了[合并双端序列](https://docs.qiime2.org/2021.2/tutorials/qiime2-for-experienced-microbiome-researchers/#merge-reads)，和[移除非生物序列](https://docs.qiime2.org/2021.2/tutorials/qiime2-for-experienced-microbiome-researchers/#remove-non-biological-sequences)（详见相关章节）。

一旦你的数据已经符合以上要求，你需要在聚类前先将序列进行去冗余。

**长度修整Length trimming**

如果由于某种原因，**原始序列没有完全相同的长度，则需要在进行OTU聚类之前将它们修剪到相同的长度**。目前还没有一个QIIME 2函数在不做其他任何事情的情况下可将序列调整至相同长度，你可以使用`cutadapt`插件中的函数来完成此事。这是因为QIIME 2工作流建议首先序列去噪（这里面包括了长度修剪步骤），然后可选地通过聚类算法获得ASV。

**质量过滤Quality filtering**

相关插件：[`quality-filter`](https://docs.qiime2.org/2021.2/plugins/available/quality-filter/)

您可以使用质量过滤插件执行不同类型的质量筛选。`q-score`方法可用于单端或双端序列（即，`SampleData[PairedEndSequencesWithQuality | SequencesWithQuality]`），而`q-score-joined`方法用于合并后的双端序列（即合并后的`SampleData[JoinedSequencesWithQuality]`）。每个方法的选项描述了不同类型的质量筛选。

**序列去冗余 Dereplicating sequences**

相关插件：[`q2-vsearch`](https://docs.qiime2.org/2021.2/plugins/available/vsearch/)

不管你使用哪种类型的聚类，您首先需要去除序列的重复。`q2-vsearch`插件的`dereplicate-sequences`方法可完成此步操作。

**无参聚类 de novo clustering**

相关插件：
- [q2-vsearch](https://docs.qiime2.org/2021.2/plugins/available/vsearch/)
- [q2-dbotu](https://library.qiime2.org/plugins/q2-dbotu/4/)

序列可以仅基于它们的遗传相似性(即VSEARCH)或基于它们的遗传相似性和丰度分布的组合(即基于分布的聚类)的从头/无参(**de novo**)聚类。

- **基于相似度的聚类**。`q2-vsearch`插件聚类方法为[`cluster-features-de-novo`](https://docs.qiime2.org/2021.2/plugins/available/vsearch/cluster-features-de-novo/)。可以使用`--p-perc-identity`参数更改遗传相似性阈值。该插件包装自`--cluster_size`函数。
- **基于分布的聚类**结合了序列之间的相似性和它们的丰度分布，以识别具有生态意义的种群。您可以在插件文档、原始文献和文献更新版本中进一步了解此方法。`q2-dbotu`插件中的`call-otus`函数对输入数据执行基于丰度分布的聚类。

这两个函数都以`q2-vsearch dereplicate-sequences`去冗余的输出作为输入，这些去冗余的序列具有QIIME 2 `FeatureData[Sequence]`数据类型和以计数表(counts table，整数频率汇总表)格式的QIIME 2 `FeatureTable[Frequency]`数据类型。

**有参聚类 closed reference clustering**

相关插件：[q2-vsearch](https://docs.qiime2.org/2021.2/plugins/available/vsearch/)

有参聚类是与数据库中的参考序列以某种相似性的序列分组在一起。

VSEARCH可以用[`cluster-features-closed-reference`](https://docs.qiime2.org/2021.2/plugins/available/vsearch/cluster-features-closed-reference/)方法进行有参聚类。此方法封装了VSEARCH中的`--usearch_global`命令。可以使用`--i-reference-sequences`参数决定要针对哪个参考数据库进行聚类。这个参数的输入文件应该是一个包含fasta文件的`.qza`文件，fasta文件具有用作参考数据库的序列，并采用QIIME 2数据类型`FeatureData[Sequence]`。大多数人对16S rRNA基因序列使用GreenGenes或SILVA，但是其他人使用自己手工校正的数据库或使用其他标准参考（例如，ITS数据的UNITE）。您可以从[QIIME 2数据资源页面](https://docs.qiime2.org/2021.2/data-resources/#marker-gene-db)上的链接下载这些参考数据库。您将需要解压缩(unzip/untar)并将它们作为`FeatureData[Sequence]`对象导入，因为它们是作为原始数据文件提供的。

### 物种分类

**Assigning taxonomy**

相关插件：[feature-classifier](https://docs.qiime2.org/2021.2/plugins/available/feature-classifier/)

将物种注释分配给ASV或OTU代表序列的方法，包含在物种分类教程中。所有物种分配方法都在[`feature-classifier`](https://docs.qiime2.org/2019.7/plugins/available/feature-classifier/)插件中。

有两类物种分类方法，每类都有多个可用的方法。

第一类是直接将序列与参考数据库比对：

- [classify-consensus-blast](https://docs.qiime2.org/2021.2/plugins/available/feature-classifier/classify-consensus-blast/)：采用BLAST+的局部比对
- [classify-consensus-vsearch](https://docs.qiime2.org/2021.2/plugins/available/feature-classifier/classify-consensus-vsearch/)：VSEARCH全局比对

两者都使用物种分配的一致方法，您可以在[概述](https://docs.qiime2.org/2021.2/tutorials/overview/#taxonomy)中了解更多，并调整最大可接受程度`maxaccepts`、一致率的百分比`perc-identity`和最小一致大小`min-consensus`等参数。

第二类方法使用机器学习分类器为序列分配可能的物种注释，并且可以通过[`classify-sklearn`](https://docs.qiime2.org/2021.2/plugins/available/feature-classifier/classify-sklearn/)命令实现。

此方法需要一个预先训练好的模型来对序列进行分类：您可以从[数据资源页面下载](https://docs.qiime2.org/2021.2/data-resources/)一个预先训练好的物种注释分类器，或者自己训练一个按照[特征分类器教程中概述的步骤](https://docs.qiime2.org/2021.2/tutorials/feature-classifier/)。您还可以在这个链接中了解更多关于[插件相关论文](https://microbiomejournal.biomedcentral.com/articles/10.1186/s40168-018-0470-z)的信息。

## 分析特征表获得新发现

**Analyze feature table and gain insight**

**相关插件**：[**太多了**！](https://docs.qiime2.org/2021.2/plugins/available/)

此时，您应该准备好分析特性表来回答您的科学问题！QIIME 2提供了多个内置函数来分析此类数据，并且您还可以[导出](https://docs.qiime2.org/2019.7/tutorials/qiime2-for-experienced-microbiome-researchers/Exportthedata)它，并使用您擅长的编程语言或软件包进行下游分析。

使用QIIME 2可以做的一些常用分析包括：

- **数据查看**：QIIME 2有一个不错的[物种组成条形图可视化工具](https://docs.qiime2.org/2021.2/plugins/available/taxa/barplot/)，使可视化地探索数据变得容易，如在分析中交互的选择不同分类层级、排序、更新配色方案等。您还可以使用[emperor插件](https://docs.qiime2.org/2021.2/plugins/available/emperor/plot/)（在计算样本之间的β距离矩阵之后）在PCoA绘图上可视化数据，实现三维可交互式探索样本和组间整体的相同与不同。
- **构建一个系统发育树**：QIIME 2有一个包括不同方法[系统发育树构建的插件](https://docs.qiime2.org/2021.2/plugins/available/phylogeny/)。
- **计算样本的α多样性**：[多样性插件](https://docs.qiime2.org/2021.2/plugins/available/diversity/)通过`alpha`、 `alpha-phylogenetic`方法提供了许多[α多样性度量指标](https://forum.qiime2.org/t/alpha-and-beta-diversity-explanations-and-commands/2282)。
- **计算样本之间的β多样性**：[多样性插件](https://docs.qiime2.org/2021.2/plugins/available/diversity/)的`beta`、`beta-phylogenetic`和`beta-phylogenetic-alt`方法中有多种度量方法。注意，`diversity core-metrics` 和`diversity core-metrics-phylogenetic`是α和β多样性分析的简单流程包装。这些内容在[概述教程](https://docs.qiime2.org/2021.2/tutorials/overview/#diversity)中进行了描述。
- **样品之间的差异**：通过差异丰度或分布检验来统计，如PERMANOVA、ANOSIM、ANCOM和Gneiss是QIIME 2中可用的一些统计方法。PERMANOVA和ANOSIM可以用多样性插件中的[`beta-group-significance`](https://docs.qiime2.org/2021.2/plugins/available/diversity/beta-group-significance/)方法完成。ANCOM在[`composition`](https://docs.qiime2.org/2021.2/plugins/available/composition/)插件中可调用。[Gneiss 插件](https://docs.qiime2.org/2021.2/plugins/available/gneiss/)中提供了gneiss分析，并有相关的教程[“Gneiss 差异丰度分析”](https://docs.qiime2.org/2021.2/tutorials/gneiss/)。
- **构建机器学习分类器和回归器进行预测**：[`q2-sample-classifier`](https://docs.qiime2.org/2021.2/plugins/available/sample-classifier/)插件有几个用于构建分类器和回归器的功能，并且相关的“[使用`q2-sample-classifier`预测样本元数据值](https://docs.qiime2.org/2021.2/tutorials/sample-classifier/)”教程提供了更多细节。

### 数据导出

**Export the data**

相关插件：`qiime tools export`

如果您是一位经验丰富的微生物组科学家，并且不想使用QIIME 2进行下游分析，那么可以使用导出工具从对象中提取特征表和序列。虽然`export`功能只输出数据，但是提取工具还允许您提取其它元数据，如引文、数据分析过程等信息。

请注意，通常的文件在输出目录中规范命名，如`feature-table.txt`，因此您可能希望立即将文件重命名为包括更多信息（或者确保它保留在原始目录中）！

您还可以使用方便的R包[`qiime2R`](https://github.com/jbisanz/qiime2R)将QIIME 2对象直接导入R。

## 新的插件

**New plugins**

可以多看看QIIME 2不断增长的[插件列表](https://docs.qiime2.org/2021.2/plugins/available/)，以找到其他适合应用于你数据的方法。

请记住，您还可以[制作自己的QIIME 2插件](https://docs.qiime2.org/2021.2/plugins/developing/)，帮助QIIME 2添加功能，并与同行共享！

## 附录1. 可导入的数据格式

```
qiime tools import --show-importable-formats
```

共有如下68种数据格式，大家从格式名称可以读出其大概的格式内容：

- AlignedDNAFASTAFormat
- AlignedDNASequencesDirectoryFormat
- AlphaDiversityDirectoryFormat
- AlphaDiversityFormat
- BIOMV100DirFmt
- BIOMV100Format
- BIOMV210DirFmt
- BIOMV210Format
- BooleanSeriesDirectoryFormat
- BooleanSeriesFormat
- CasavaOneEightLanelessPerSampleDirFmt
- CasavaOneEightSingleLanePerSampleDirFmt
- DADA2StatsDirFmt
- DADA2StatsFormat
- DNAFASTAFormat
- DNASequencesDirectoryFormat
- DeblurStatsDirFmt
- DeblurStatsFmt
- DifferentialDirectoryFormat
- DifferentialFormat
- DistanceMatrixDirectoryFormat
- EMPPairedEndCasavaDirFmt
- EMPPairedEndDirFmt
- EMPSingleEndCasavaDirFmt
- EMPSingleEndDirFmt
- ErrorCorrectionDetailsDirFmt
- FastqGzFormat
- FirstDifferencesDirectoryFormat
- FirstDifferencesFormat
- HeaderlessTSVTaxonomyDirectoryFormat
- HeaderlessTSVTaxonomyFormat
- ImportanceDirectoryFormat
- ImportanceFormat
- LSMatFormat
- MultiplexedPairedEndBarcodeInSequenceDirFmt
- MultiplexedSingleEndBarcodeInSequenceDirFmt
- NewickDirectoryFormat
- NewickFormat
- OrdinationDirectoryFormat
- OrdinationFormat
- PairedDNASequencesDirectoryFormat
- PairedEndFastqManifestPhred33
- PairedEndFastqManifestPhred33V2
- PairedEndFastqManifestPhred64
- PairedEndFastqManifestPhred64V2
- PlacementsDirFmt
- PlacementsFormat
- PredictionsDirectoryFormat
- PredictionsFormat
- ProbabilitiesDirectoryFormat
- ProbabilitiesFormat
- QIIME1DemuxDirFmt
- QIIME1DemuxFormat
- QualityFilterStatsDirFmt
- QualityFilterStatsFmt
- SampleEstimatorDirFmt
- SeppReferenceDirFmt
- SingleEndFastqManifestPhred33
- SingleEndFastqManifestPhred33V2
- SingleEndFastqManifestPhred64
- SingleEndFastqManifestPhred64V2
- SingleLanePerSamplePairedEndFastqDirFmt
- SingleLanePerSampleSingleEndFastqDirFmt
- TSVTaxonomyDirectoryFormat
- TSVTaxonomyFormat
- TaxonomicClassiferTemporaryPickleDirFmt
- UchimeStatsDirFmt
- UchimeStatsFmt

## 附录2. 可导入的数据类型

```
qiime tools import --show-importable-types
```

目前支持如下42种数据类型：

主要是关于特征表`FeatureData`和样本元数据`SampleData`的多种变体。

- DeblurStats
- DistanceMatrix
- EMPPairedEndSequences
- EMPSingleEndSequences
- ErrorCorrectionDetails
- FeatureData[AlignedSequence]
- FeatureData[Differential]
- FeatureData[Importance]
- FeatureData[PairedEndSequence]
- FeatureData[Sequence]
- FeatureData[Taxonomy]
- FeatureTable[Balance]
- FeatureTable[Composition]
- FeatureTable[Frequency]
- FeatureTable[PercentileNormalized]
- FeatureTable[PresenceAbsence]
- FeatureTable[RelativeFrequency]
- Hierarchy
- MultiplexedPairedEndBarcodeInSequence
- MultiplexedSingleEndBarcodeInSequence
- PCoAResults
- Phylogeny[Rooted]
- Phylogeny[Unrooted]
- Placements
- QualityFilterStats
- RawSequences
- SampleData[AlphaDiversity]
- SampleData[BooleanSeries]
- SampleData[ClassifierPredictions]
- SampleData[DADA2Stats]
- SampleData[FirstDifferences]
- SampleData[JoinedSequencesWithQuality]
- SampleData[PairedEndSequencesWithQuality]
- SampleData[Probabilities]
- SampleData[RegressorPredictions]
- SampleData[SequencesWithQuality]
- SampleData[Sequences]
- SampleEstimator[Classifier]
- SampleEstimator[Regressor]
- SeppReferenceDatabase
- TaxonomicClassifier
- UchimeStats

## 译者简介

**刘永鑫**，博士，高级工程师，中科院青促会会员，QIIME 2项目参与人。2008年毕业于东北农业大学微生物学专业，2014年于中国科学院大学获生物信息学博士，2016年遗传学博士后出站留所工作，任工程师，研究方向为宏基因组数据分析。目前在***Science、Nature Biotechnology、Protein & Cell、Current Opinion in Microbiology***等杂志发表论文30余篇，被引3千余次。2017年7月创办“宏基因组”公众号，分享宏基因组、扩增子研究相关文章2400余篇，代表作有[《扩增子图表解读、分析流程和统计绘图三部曲(21篇)》](https://mp.weixin.qq.com/s/u7PQn2ilsgmA6Ayu-oP1tw)、 [《微生物组实验手册》](https://mp.weixin.qq.com/s/PzFglpqW1RwoqTLghpAIbA)、[《微生物组数据分析》](https://mp.weixin.qq.com/s/xHe1FHLm3n0Vkxz0nNbXvQ)等，关注人数11万+，累计阅读2100万+。

## Reference

https://docs.qiime2.org/2021.2/

Evan Bolyen*, Jai Ram Rideout*, Matthew R. Dillon*, Nicholas A. Bokulich*, Christian C. Abnet, Gabriel A. Al-Ghalith, Harriet Alexander, Eric J. Alm, Manimozhiyan Arumugam, Francesco Asnicar, Yang Bai, Jordan E. Bisanz, Kyle Bittinger, Asker Brejnrod, Colin J. Brislawn, C. Titus Brown, Benjamin J. Callahan, Andrés Mauricio Caraballo-Rodríguez, John Chase, Emily K. Cope, Ricardo Da Silva, Christian Diener, Pieter C. Dorrestein, Gavin M. Douglas, Daniel M. Durall, Claire Duvallet, Christian F. Edwardson, Madeleine Ernst, Mehrbod Estaki, Jennifer Fouquier, Julia M. Gauglitz, Sean M. Gibbons, Deanna L. Gibson, Antonio Gonzalez, Kestrel Gorlick, Jiarong Guo, Benjamin Hillmann, Susan Holmes, Hannes Holste, Curtis Huttenhower, Gavin A. Huttley, Stefan Janssen, Alan K. Jarmusch, Lingjing Jiang, Benjamin D. Kaehler, Kyo Bin Kang, Christopher R. Keefe, Paul Keim, Scott T. Kelley, Dan Knights, Irina Koester, Tomasz Kosciolek, Jorden Kreps, Morgan G. I. Langille, Joslynn Lee, Ruth Ley, **Yong-Xin Liu**, Erikka Loftfield, Catherine Lozupone, Massoud Maher, Clarisse Marotz, Bryan D. Martin, Daniel McDonald, Lauren J. McIver, Alexey V. Melnik, Jessica L. Metcalf, Sydney C. Morgan, Jamie T. Morton, Ahmad Turan Naimey, Jose A. Navas-Molina, Louis Felix Nothias, Stephanie B. Orchanian, Talima Pearson, Samuel L. Peoples, Daniel Petras, Mary Lai Preuss, Elmar Pruesse, Lasse Buur Rasmussen, Adam Rivers, Michael S. Robeson, Patrick Rosenthal, Nicola Segata, Michael Shaffer, Arron Shiffer, Rashmi Sinha, Se Jin Song, John R. Spear, Austin D. Swafford, Luke R. Thompson, Pedro J. Torres, Pauline Trinh, Anupriya Tripathi, Peter J. Turnbaugh, Sabah Ul-Hasan, Justin J. J. van der Hooft, Fernando Vargas, Yoshiki Vázquez-Baeza, Emily Vogtmann, Max von Hippel, William Walters, Yunhu Wan, Mingxun Wang, Jonathan Warren, Kyle C. Weber, Charles H. D. Williamson, Amy D. Willis, Zhenjiang Zech Xu, Jesse R. Zaneveld, Yilong Zhang, Qiyun Zhu, Rob Knight & J. Gregory Caporaso#. Reproducible, interactive, scalable and extensible microbiome data science using QIIME 2. ***Nature Biotechnology***. 2019, 37: 852-857. doi:[10.1038/s41587-019-0209-9](https://doi.org/10.1038/s41587-019-0209-9)

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