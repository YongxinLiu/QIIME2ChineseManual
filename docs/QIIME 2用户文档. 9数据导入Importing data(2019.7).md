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


# QIIME 2用户文档. 9数据导入

**Importing data**

原文地址： https://docs.qiime2.org/2019.7/tutorials/importing/

为了使用QIIME 2，输入数据必须存储在`QIIME 2对象（即qza文件）`中。这是实现支持分布式和自动来源跟踪、以及语义类型验证和数据格式之间的转换所必须（有关QIIME 2对象的更多详细信息，请参阅[《1简介和安装》](https://mp.weixin.qq.com/s/xmfoA7MCSoRlnKJJgH823g)中核心概念部分）。本教程演示如何将各种数据格式导入到QIIME 2对象中，以便使用QIIME 2开展分析。

> 注：本教程并没有描述QIIME 2中当前支持的所有数据格式。这是一项正在进行的工作，描述了一些最常用的可用数据格式。我们还积极支持其他数据格式。如果您需要导入的数据格式不在这里介绍，请发到QIIME 2论坛寻求帮助。

导入通常与初始化数据一起进行（例如，从测序仪获取的原始序列），但也可以在分析流程的任何步骤中执行导入。例如，如果合作者向您提供`.biom`格式的特征表，您可以将其导入到QIIME 2对象中，以执行对特征表进行操作的“下游”统计分析。

可以使用任何QIIME 2接口完成导入。本教程将重点介绍使用QIIME 2命令行界面（q2cli）使用`qiime tools import`方法导入数据。下面的每一节简要描述了一种数据格式，提供了下载示例数据的命令，并演示了如何将数据导入到QIIME 2对象中。

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

# 创建本节学习目录
mkdir qiime2-importing-tutorial
cd qiime2-importing-tutorial
```

## 导入带质量值的FASTQ测序数据

**Sequence data with sequence quality information (i.e. FASTQ)**

使用QIIME 2，可以导入不同类型的fastq数据：

- 采用地球微生物组计划(EMP)标准方法产生的FASTQ格式数据
- CASAVA 1.8多样本混合格式的FASTQ数据
- 任何其他类型的fastq数据

### EMP标准混样单端数据

**“EMP protocol” multiplexed single-end fastq**

此类数据标准包括两个文件，扩展名均为`fastq.gz`，
1. 一个是barcode文件，
2. 另一个是样品混样测序数据文件。

此部分的数据己经在[《4人体各部位微生物组分析》](https://mp.weixin.qq.com/s/U-B5mIDJzOLpbm4DOfcqXA)中下载过，可直接链接过来，或使用如下命令下载

```
# 建样品目录
mkdir -p emp-single-end-sequences

# 方法1. 链接之前第4节中的文件
ln ../qiime2-moving-pictures-tutorial/emp-single-end-sequences/*.gz emp-single-end-sequences/

# 方法2. 从头下载
# 下载 barcode文件
wget -c \
  -O "emp-single-end-sequences/barcodes.fastq.gz" \
  "https://data.qiime2.org/2019.7/tutorials/moving-pictures/emp-single-end-sequences/barcodes.fastq.gz"

# 下载序列文件
wget -c \
  -O "emp-single-end-sequences/sequences.fastq.gz" \
  "https://data.qiime2.org/2019.7/tutorials/moving-pictures/emp-single-end-sequences/sequences.fastq.gz"
```

导入EMP单端测序文件命令格式

```
# 25M，8s
time qiime tools import \
  --type EMPSingleEndSequences \
  --input-path emp-single-end-sequences \
  --output-path emp-single-end-sequences.qza
```

输出对象：

- `emp-single-end-sequences.qza`：导入的EMP单端序列。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2019.7%2Fdata%2Ftutorials%2Fimporting%2Femp-single-end-sequences.qza) | [下载](https://docs.qiime2.org/2019.7/data/tutorials/importing/emp-single-end-sequences.qza)

### EMP混样双端数据

**“EMP protocol” multiplexed paired-end fastq**

此类数据标准包括三个文件，扩展名均为`fastq.gz`，

1. 一个是`fastq.gz`的正向序列文件；
2. 一个是`fastq.gz`的反向序列文件；
3. 一个是barcode文件，与序列对应。

此部分的数据己经在 [《6沙漠土壤分析Atacama soil》](https://mp.weixin.qq.com/s/gB0Y8P0uzpIA1pml9nSf7g) 中下载过，可直接硬链过来，或使用如下命令下载

```
# 建样品目录
mkdir -p emp-paired-end-sequences

# 方法1. 链接之前第4节中的文件
ln ../qiime2-atacama-tutorial/emp-paired-end-sequences/*.gz emp-paired-end-sequences/

# 方法2. 从头下载
# 下载序列正向和反向文件
wget -c \
  -O "emp-paired-end-sequences/forward.fastq.gz" \
  "https://data.qiime2.org/2019.7/tutorials/atacama-soils/1p/forward.fastq.gz"
wget -c \
  -O "emp-paired-end-sequences/reverse.fastq.gz" \
  "https://data.qiime2.org/2019.7/tutorials/atacama-soils/1p/reverse.fastq.gz"

# 下载barcode文件
wget -c \
  -O "emp-paired-end-sequences/barcodes.fastq.gz" \
  "https://data.qiime2.org/2019.7/tutorials/atacama-soils/1p/barcodes.fastq.gz"
```

导入EMP双端序列为QIIME2对象

```
# 50M， 11s
time qiime tools import \
  --type EMPPairedEndSequences \
  --input-path emp-paired-end-sequences \
  --output-path emp-paired-end-sequences.qza
```

输出对象：

- `emp-paired-end-sequences.qza`：导入的EMP单端序列。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2019.7%2Fdata%2Ftutorials%2Fimporting%2Femp-paired-end-sequences.qza) | [下载](https://docs.qiime2.org/2019.7/data/tutorials/importing/emp-paired-end-sequences.qza)

### Casava1.8单端混样数据

**Casava 1.8 single-end demultiplexed fastq**

格式描述
在Casava 1.8单样本（单端）的格式中，有一个`fastq.gz`文件的包含每个样品的单端序列。样品文件名包括标识符，看起来像`L2S357_15_L001_R1_001.fastq.gz`。文件名中下划线分隔的区域代表的意义如下：

1. 在样品编号；
2. 标签barcode序列或编号；
3. lane编号；
4. 序列方向（如仅有R1是由于单端序列）
5. 子集编号。

下载并解压示例数据

```
# 20M
wget -c \
  -O "casava-18-single-end-demultiplexed.zip" \
  "https://data.qiime2.org/2019.7/tutorials/importing/casava-18-single-end-demultiplexed.zip"
unzip -q casava-18-single-end-demultiplexed.zip
```

导入数据，因为样品名包括在文件名中，可直接导入

```
# 20M, 6s
time qiime tools import \
  --type 'SampleData[SequencesWithQuality]' \
  --input-path casava-18-single-end-demultiplexed \
  --input-format CasavaOneEightSingleLanePerSampleDirFmt \
  --output-path demux-single-end.qza
```

输出对象：

- `demux-single-end.qza`：导入的EMP单端序列。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2019.7%2Fdata%2Ftutorials%2Fimporting%2Fdemux-single-end.qza) | [下载](https://docs.qiime2.org/2019.7/data/tutorials/importing/demux-single-end.qza)

### Casava 1.8双端拆分后数据

**Casava 1.8 paired-end demultiplexed fastq**

格式同上面单端，只是每个样本有一对文件。R1和R2代表正向和反向测序结果。

下载并解压示例数据

```
# 9.3 M
wget -c \
  -O "casava-18-paired-end-demultiplexed.zip" \
  "https://data.qiime2.org/2019.7/tutorials/importing/casava-18-paired-end-demultiplexed.zip"
unzip -q casava-18-paired-end-demultiplexed.zip
```

导入数据，因为样品名包括在文件名中，可直接导入

```
# 9M, 6s
time qiime tools import \
  --type 'SampleData[PairedEndSequencesWithQuality]' \
  --input-path casava-18-paired-end-demultiplexed \
  --input-format CasavaOneEightSingleLanePerSampleDirFmt \
  --output-path demux-paired-end.qza
```

输出对象：

- `demux-paired-end.qza`：导入的EMP单端序列。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2019.7%2Fdata%2Ftutorials%2Fimporting%2Fdemux-paired-end.qza) | [下载](https://docs.qiime2.org/2019.7/data/tutorials/importing/demux-paired-end.qza)

### **Fastq样品文件清单格式**

**“Fastq manifest” formats**

**划重点，这应该是普通用户最常用的格式。而且导入方式也有更新，请以最新版为准**

如果你不是EMP或CASAVA格式的数据，则需要先创建一个“清单文件（“manifest file）”，然后使用`qiime tools import`命令，手动将数据导入到QIIME 2。

#### 格式说明

首先，您将创建一个名为“清单文件”的文本文件，它将示例标识符映射到`fastq.gz`或`fastq`的[绝对文件路径(absolute filepaths)](https://en.wikipedia.org/wiki/Path_(computing)#Absolute_and_relative_paths)，其中包含示例的序列和质量数据（即，这些是fastq文件）。清单文件还指示每个fastq.gz或fastq文件中的读取方向。清单文件通常由您创建，它被设计为一种简单的格式，不会拆分好的`fastq.gz/fastq`文件的命名设置限制，因为这些文件没有广泛使用的命名约定。您可以随意调用清单文件。同时，清单文件也是元数据格式兼容的，因此你可以清单文件作为[样本元数据(Sample Metadata)](https://docs.qiime2.org/2019.7/tutorials/metadata/)的起始。

清单文件是制表符分隔（即.tsv）的文本文件。每行的第一个字段是样本名，第二个字段是绝对文件路径，第三个字段可选的反应序列文件路径。此格式与[QIIME 2元数据格式(https://docs.qiime2.org/2019.7/tutorials/metadata)](https://docs.qiime2.org/2019.7/tutorials/metadata/)兼容。

`fastq.gz`文件位置的绝对文件路径可以包含环境变量（例如$HOME或$PWD）。下面的示例说明了一个简单的fastq清单文件，用于两个示例的双端数据。

```
sample-id     forward-absolute-filepath       reverse-absolute-filepath
sample-1      $PWD/some/filepath/sample0_R1.fastq.gz  $PWD/some/filepath/sample1_R2.fastq.gz
sample-2      $PWD/some/filepath/sample2_R1.fastq.gz  $PWD/some/filepath/sample2_R2.fastq.gz
sample-3      $PWD/some/filepath/sample3_R1.fastq.gz  $PWD/some/filepath/sample3_R2.fastq.gz
sample-4      $PWD/some/filepath/sample4_R1.fastq.gz  $PWD/some/filepath/sample4_R2.fastq.gz
```

在文件清单中，`fastq.gq`文件绝对路径必须准确，下面的示例说明了一个示例的fastq单端数据的清单文件。

```
sample-id     absolute-filepath
sample-1      $PWD/some/filepath/sample1_R1.fastq
sample-2      $PWD/some/filepath/sample2_R1.fastq
```

FastQ数据有四种常用格式变体，导入时必须将其指定为QIIME 2的类型。我们提供其中两种导入的示例：`SingleEndFastqManifestPhred33V2`和`PairedEndFastqManifestPhred64V2`，因为他们是相似的

#### **SingleEndFastqManifestPhred33V2**

质量值33类型的单端数据

注：V2是为了区别于旧版csv清单文件格式的导入。建议以新教程为准，更合理。

在这个fastq清单格式的变体中，读取方向必须都是正向或反向的。此格式假定用于所有`fastq.gz/fastq`文件中位置质量分数的偏移量为33(注：质量值多为大写字母)。

```
# 下载fastq单双端样本压缩包zip文件，和文件清单文件mainfest
wget -c \
  -O "se-33.zip" \
  "https://data.qiime2.org/2019.7/tutorials/importing/se-33.zip"
wget -c \
  -O "se-33-manifest" \
  "https://data.qiime2.org/2019.7/tutorials/importing/se-33-manifest"

unzip -q se-33.zip
```

导入质量值不同编码的两类文件Phred33/64 (一般Phred33比较常见，只有非常老的数据才有Phred64格式或测序公司非正常设置的结果，建议转换成了这个主流格式)

```
# 导入Phred33格式单端测序结果
time qiime tools import \
  --type 'SampleData[SequencesWithQuality]' \
  --input-path se-33-manifest \
  --output-path single-end-demux.qza \
  --input-format SingleEndFastqManifestPhred33
```

输出对象：

- `single-end-demux.qza`：导入标准fastq单端输入文件。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2019.7%2Fdata%2Ftutorials%2Fimporting%2Fsingle-end-demux.qza) | [下载](https://docs.qiime2.org/2019.7/data/tutorials/importing/single-end-demux.qza)

#### **SingleEndFastqManifestPhred64V2**

**质量值64类型的单端数据**

在这个fastq清单格式的变体中，读取方向必须都是正向或反向的。此格式假定用于所有`fastq.gz/fastq`文件中位置质量分数的分段偏移量为64。在导入过程中，QIIME 2会将phred 64编码的质量分数转换为phred 33编码的质量分数。这种转换将很慢，但只会发生一次(非主流，很多软件如usearch都不支持，外部可以使用fastp、vsearch等程序转换，QIIME2会自动转换后再进行分析，查看文件质量值多为小写字母的为64类型)。

**PairedEndFastqManifestPhred33V2**

**质量值33类型的双端数据，划重点，此类型最为常用**

在这种fastq文件清单格式的变体中，每个样本ID必须有正向和反向读取`fastq.gz/fastq`文件。此格式假定用于所有`fastq.gz/fastq`文件中位置质量分数的分段偏移量为33。

**PairedEndFastqManifestPhred64V2**

**质量值64类型的双端数据**

在这种fastq文件清单格式的变体中，每个样本ID必须有正向和反向读取`fastq.gz/fastq`文件。此格式假定用于所有`fastq.gz/fastq`文件中位置质量分数的分段偏移量为64。在导入过程中，QIIME 2会将phred 64编码的质量分数转换为phred 33编码的质量分数。这种转换将很慢，但只会发生一次。

```
wget -c \
  -O "pe-64.zip" \
  "https://data.qiime2.org/2019.7/tutorials/importing/pe-64.zip"
wget \
  -O "pe-64-manifest" \
  "https://data.qiime2.org/2019.7/tutorials/importing/pe-64-manifest"
unzip -q pe-64.zip

# 4s
time qiime tools import \
  --type 'SampleData[PairedEndSequencesWithQuality]' \
  --input-path pe-64-manifest \
  --output-path paired-end-demux.qza \
  --input-format PairedEndFastqManifestPhred64V2
```

- `paired-end-demux.qza`：导入标准fastq单端输入文件。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2019.7%2Fdata%2Ftutorials%2Fimporting%2Fpaired-end-demux.qza) | [下载](https://docs.qiime2.org/2019.7/data/tutorials/importing/paired-end-demux.qza)

## fasta格式序列

**Sequences without quality information (i.e. FASTA)**

QIIME 2目前支持导入QIIME 1 `seqs.fna`文件格式，该格式由一个fasta文件组成，每条记录只有两行：`header`和`sequence`。每个序列必须正好一行，不能拆分多行。每条序列的ID必须遵循格式<sample-id>_<seq-id>的要求。<sample id>是序列所属样本的标识符，<seq id>是其样本中序列的标识符。

在[OTU聚类教程](https://docs.qiime2.org/2019.7/tutorials/otu-clustering/)中可以找到导入和去冗余此类数据的示例。

目前不支持其他fasta格式，如具有不同格式序列名的fasta文件或按样本分离的fasta文件（即每个样本一个fasta文件）。


## 代表性序列

**Per-feature unaligned sequence data (i.e., representative FASTA sequences)**

### 格式说明

未对齐的序列数据包含未对齐的DNA序列（即不包含-或.）的fasta格式文件）。序列可能包含未知的核苷酸特征，如N，但某些QIIME 2功能不支持这类字符。有关fasta格式的更多信息，请参阅[scikit bio fasta格式说明](http://scikit-bio.org/docs/latest/generated/skbio.io.format.fasta.html#fasta-format)。

获取示例数据

```
# 175 kb
wget -c \
  -O "sequences.fna" \
  "https://data.qiime2.org/2019.7/tutorials/importing/sequences.fna"
```

### 导入数据

```
# 5s
time qiime tools import \
  --input-path sequences.fna \
  --output-path sequences.qza \
  --type 'FeatureData[Sequence]'
```

输出对象：

- `sequences.qza`：导入标准fastq单端输入文件。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2019.7%2Fdata%2Ftutorials%2Fimporting%2Fsequences.qza) | [下载](https://docs.qiime2.org/2019.7/data/tutorials/importing/sequences.qza)

## 对齐的fasta格式文件

**Per-feature aligned sequence data (i.e., aligned representative FASTA sequences)**

### 格式说明

对齐序列数据是从一个fasta格式的文件中导入的，该文件包含相互对齐的DNA序列。所有对齐序列的长度必须完全相同。序列可能包含未知的核苷酸特征，如N，但某些QIIME 2功能不支持这类字符。有关fasta格式的更多信息，请参阅[`scikit bio fasta`格式说明](http://scikit-bio.org/docs/latest/generated/skbio.io.format.fasta.html#fasta-format)。

获取示例数据

```
wget -c \
  -O "aligned-sequences.fna" \
  "https://data.qiime2.org/2019.7/tutorials/importing/aligned-sequences.fna"
```

可能有的人不了解对齐的fasta格式，如下：有`-`字符，且等长

```
>New.CleanUp.ReferenceOTU0 K3.H_3016
-CTGGACCGTGTCTCAGTT-CCAGTGTGGCTGATCATCCT---------CTCAGACCAGC
TACCGATCGTCGCC-TTGGTGGG-CTCTTA-CCC-C-GCCAACTAGCTAATCGGGCATCG
-G-CTCATTC-AATCGCGCAAGGTCCG-----AA----------------G-ATC-CCCT
>New.CleanUp.ReferenceOTU1 K3.Z_32919
-CTGGACCGTGTCTCAGTT-CCAGTGTGGCCGTTCATCCT---------CTCAGACCGGC
TACTGATCGTTGGT-TTGGTGGG-CCGTTA-CCC-C-ACCAACTGCCTAATCAGACGCAA
-A-CCCCTCT-TCAGGCGATAGCTTACAGGTAGAGGCTA-------------CCC-TTTC
```

### 导入数据

```
# 4s
time qiime tools import \
  --input-path aligned-sequences.fna \
  --output-path aligned-sequences.qza \
  --type 'FeatureData[AlignedSequence]'
```

输出对象：

- `aligned-sequences.qza`：对齐的fasta序列。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2019.7%2Fdata%2Ftutorials%2Fimporting%2Faligned-sequences.qza) | [下载](https://docs.qiime2.org/2019.7/data/tutorials/importing/aligned-sequences.qza)


## 特征表 Feature table data

你可以导入预处理的特征进入QIIME 2分析

### BIOM v1.0.0

关于BIOM格式说明，详见 [《BIOM：生物观测矩阵——微生物组数据通用数据格式》](https://mp.weixin.qq.com/s/R1lDzm8eSBibhL8PkDSJJA)，或[BIOM v1.0.0 format specification英文格式说明](http://biom-format.org/documentation/format_versions/biom-1.0.html)。

下载数据并导入为QIIME2的qza格式

```
wget -c \
  -O "feature-table-v100.biom" \
  "https://data.qiime2.org/2019.7/tutorials/importing/feature-table-v100.biom"
  
time qiime tools import \
  --input-path feature-table-v100.biom \
  --type 'FeatureTable[Frequency]' \
  --input-format BIOMV100Format \
  --output-path feature-table-1.qza
```

输出对象：

- `feature-table-1.qza`：导入特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2019.7%2Fdata%2Ftutorials%2Fimporting%2Ffeature-table-1.qza) | [下载](https://docs.qiime2.org/2019.7/data/tutorials/importing/feature-table-1.qza)

### BIOM v2.1.0

[BIOM v2.1.0 格式详细信息](http://biom-format.org/documentation/format_versions/biom-2.1.html)

```
wget -c \
  -O "feature-table-v210.biom" \
  "https://data.qiime2.org/2019.7/tutorials/importing/feature-table-v210.biom"

time qiime tools import \
  --input-path feature-table-v210.biom \
  --type 'FeatureTable[Frequency]' \
  --input-format BIOMV210Format \
  --output-path feature-table-2.qza
```

输出对象：

- `feature-table-2.qza`：导入的特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2019.7%2Fdata%2Ftutorials%2Fimporting%2Ffeature-table-2.qza) | [下载](https://docs.qiime2.org/2019.7/data/tutorials/importing/feature-table-2.qza)


## 系统发育树

**Phylogenetic trees**

通常为newick格式。详细说明见[scikit-bio newick格式描述](http://scikit-bio.org/docs/latest/generated/skbio.io.format.newick.html)

```
wget -c \
  -O "unrooted-tree.tre" \
  "https://data.qiime2.org/2019.7/tutorials/importing/unrooted-tree.tre"
  
time qiime tools import \
  --input-path unrooted-tree.tre \
  --output-path unrooted-tree.qza \
  --type 'Phylogeny[Unrooted]'
```

输出对象：

- `unrooted-tree.qza`：导入的无根树文件。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2019.7%2Fdata%2Ftutorials%2Fimporting%2Funrooted-tree.qza) | [下载](https://docs.qiime2.org/2019.7/data/tutorials/importing/unrooted-tree.qza)



## 其它数据类型

**Other data types**

QIIME2支持多达58种数据格式，可用如下命令查看

```
qiime tools import \
  --show-importable-formats
```

支持的67种格式如下：

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

可导入的文件类型有哪些呢？

```
qiime tools import \
  --show-importable-types
```

也有多达41种：

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
- TaxonomicClassifier
- UchimeStats

不幸的是，目前没有文档详细说明可以将哪些数据格式导入为哪种QIIME 2数据类型，但是希望这些格式和类型的名称应该是不言自明的，足以弄清楚。 如有任何疑问，请发布至[QIIME 2论坛](https://forum.qiime2.org/)寻求帮助！

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