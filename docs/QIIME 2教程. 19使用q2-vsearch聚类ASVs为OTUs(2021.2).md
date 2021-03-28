[TOC]

# 使用`q2-vsearch`聚类序列为OTUs

**Clustering sequences into OTUs using q2-vsearch**

目前QIIME2支持三个聚类方式：无参(De novo), 有参(closed-reference), 和半有参(open-reference clustering，即先有参比对再将无法比对序列进行无参聚类)。

目前运行[vsearch](https://peerj.com/articles/2584/)仅能对拆分和质控后的数据进行OTUs聚类 (如`SampleData[Sequences]`对象), 或**质控后的特征表和代表性序列(如`FeatureTable[Frequency]`和`FeatureData[Sequence]`对象**, 这些文件可以由`qiime dada2 denoise-*`或`qiime deblur denoise-*`命令产生)。第一选择需要两步（在将来可能一步就搞定）。第二选择只需一步完成。

> QIIME 1用户：在QIIME1中，由`split_libraries*.py`命令进行样本序列拆分、质量过滤，生成文件为`seqs.fna`。

在学习完本教程之后，您将知道如何运行从头，封闭参考和开放参考集群。 这将从一个QIIME 1 seqs.fna文件开始进行说明，该文件将被读取到SampleData [Sequences]工件中。 如果您已经具有要聚类的FeatureTable [Frequency]和FeatureData [Sequence]工件，则可以跳到本教程的FeatureTable [Frequency]和FeatureData [Sequence]聚类。

## 下载数据

```
mkdir -p otu-clustering
cd otu-clustering

wget -c https://data.qiime2.org/2020.11/tutorials/otu-clustering/seqs.fna
wget -c https://data.qiime2.org/2020.11/tutorials/otu-clustering/85_otus.qza
```

## 序列去冗余 

**Dereplicating a `SampleData[Sequences]` artifact**

如果您开始分析时使用的是样本拆分、质量控制的序列，例如[QIIME 1的seqs.fna文件](http://qiime.org/documentation/file_formats.html#post-split-libraries-fasta-file-overview)中的序列，那么第一步是将数据导入为QIIME 1对象。这里使用的语义类型是`SampleData[Sequences]`，表示数据是一个或多个样本的序列集合。

```
qiime tools import \
  --input-path seqs.fna \
  --output-path seqs.qza \
  --type 'SampleData[Sequences]'
```

**输出对象：**

- `85_otus.qza`: 按85%相似度聚类的OTU。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.11%2Fdata%2Ftutorials%2Fotu-clustering%2F85_otus.qza) | [下载](https://docs.qiime2.org/2020.11/data/tutorials/otu-clustering/85_otus.qza)
- `seqs.qza`: 导入的序列文件。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.11%2Fdata%2Ftutorials%2Fotu-clustering%2Fseqs.qza) | [下载](https://docs.qiime2.org/2020.11/data/tutorials/otu-clustering/seqs.qza)


导入后，使用`dereplicate-sequences`进行序列去冗余 

```
qiime vsearch dereplicate-sequences \
  --i-sequences seqs.qza \
  --o-dereplicated-table table.qza \
  --o-dereplicated-sequences rep-seqs.qza
```

**输出结果:**

- `rep-seqs.qza`: 代表序列。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.11%2Fdata%2Ftutorials%2Fotu-clustering%2Frep-seqs.qza) | [下载](https://docs.qiime2.org/2020.11/data/tutorials/otu-clustering/rep-seqs.qza)
- `table.qza`: 特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.11%2Fdata%2Ftutorials%2Fotu-clustering%2Ftable.qza) | [下载](https://docs.qiime2.org/2020.11/data/tutorials/otu-clustering/table.qza)

序列去冗余`dereplicate-sequences`的输出是一个`FeatureTable[Frequency]`和一个`FeatureData[Sequence]`对象。`FeatureTable[Frequency]`对象是特征表，指示在每个样本中观察到的每个Amplicon序列变体（ASV）的次数。`FeatureData[Sequence]`对象包含每个功能标识符到定义该特征序列变量的映射。这些文件类似于`qiime dada2 denoise-*`和`qiime deblur denoise-*`生成的文件，只是在去噪过程中没有应用去噪、去除嵌合体或其他质量控制。（在本例中，这些数据的唯一质量控制是在导入`import`步骤之前，即在QIIME 2之外的程序进行的）

## 特征[频率]和特征数据[序列]的聚类

**Clustering of `FeatureTable[Frequency]` and `FeatureData[Sequence]`**

QIIME2中的OTU聚类目前应用于一个 `FeatureTable[Frequency]`对象和一个`FeatureData[Sequence]`对象。这些对象可以来自各种分析流程，包括`qiime vsearch dereplicate-sequences`（如上所示）、`qiime dada2 denoise-*`和`qiime deblur denoise-*`，或者下面所示的一个聚类过程（例如，以较低的百分比序列一致率对数据进行重新聚类）。

`FeatureData[Sequence]`对象中的序列两两比对（*de novo* 聚类）或比对参考数据库（closed-reference聚类），然后可折叠特征表`FeatureTable`中的特征，从而形成输入特征的新特征聚类。

### 无参/从头聚类

***De novo* clustering**

特性表的无参(从头/新)聚类(De novo clustering)可以用如下命令实现。在这个例子中，聚类是按序列相似度99%的水平执行的，以创建99%的OTU。

```
qiime vsearch cluster-features-de-novo \
  --i-table table.qza \
  --i-sequences rep-seqs.qza \
  --p-perc-identity 0.99 \
  --o-clustered-table table-dn-99.qza \
  --o-clustered-sequences rep-seqs-dn-99.qza
```

**输出对象:**

- `table-dn-99.qza`: 99%相似度聚类的OTUs表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.11%2Fdata%2Ftutorials%2Fotu-clustering%2Ftable-dn-99.qza) | [下载](https://docs.qiime2.org/2020.11/data/tutorials/otu-clustering/table-dn-99.qza)
- `rep-seqs-dn-99.qza`: 99%相似度聚类的代表序列。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.11%2Fdata%2Ftutorials%2Fotu-clustering%2Frep-seqs-dn-99.qza) | [下载](https://docs.qiime2.org/2020.11/data/tutorials/otu-clustering/rep-seqs-dn-99.qza)

该过程的输出是`FeatureTable [Frequency]`对象和`FeatureData [Sequence]`对象。 `FeatureData [Sequence]`对象将包含定义每个OTU聚类的**质心(centroid)**序列，即最高丰度序列。


### 有参聚类

**Closed-reference clustering**

特性表的有参聚类可以用如下方法执行。在这个例子中，聚类是在85%的一致性下对GreenGenes 13_8 85%的OTU参考数据库进行比对的。参考数据库作为`FeatureData[Sequence]`对象。

> 注释：有参OTU聚类通常以更高的相似度合并，但这里使用85%，因此本教程的用户不必下载更大的参考数据库。通常，在某个百分比处对聚集在同一百分比相似度的参考数据库执行聚类，但这并没有正确地进行基准测试，以确定它是否是执行有参聚类的最佳方法。

```
qiime vsearch cluster-features-closed-reference \
  --i-table table.qza \
  --i-sequences rep-seqs.qza \
  --i-reference-sequences 85_otus.qza \
  --p-perc-identity 0.85 \
  --o-clustered-table table-cr-85.qza \
  --o-clustered-sequences rep-seqs-cr-85.qza \
  --o-unmatched-sequences unmatched-cr-85.qza
```

输出对象:

- `table-cr-85.qza`: 特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.11%2Fdata%2Ftutorials%2Fotu-clustering%2Ftable-cr-85.qza) | [下载](https://docs.qiime2.org/2020.11/data/tutorials/otu-clustering/table-cr-85.qza)
- `unmatched-cr-85.qza`: 无法比对的序列。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.11%2Fdata%2Ftutorials%2Fotu-clustering%2Funmatched-cr-85.qza) | [下载](https://docs.qiime2.org/2020.11/data/tutorials/otu-clustering/unmatched-cr-85.qza)
- `rep-seqs-cr-85.qza`: 代表序列。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.11%2Fdata%2Ftutorials%2Fotu-clustering%2Frep-seqs-cr-85.qza) | [下载](https://docs.qiime2.org/2020.11/data/tutorials/otu-clustering/rep-seqs-cr-85.qza)

`cluster-features-closed-reference`输出的结果是一个`FeatureTable[Frequency]`对象和一个`FeatureData[Sequence]`对象。在这种情况下，序列`FeatureData[Sequence]`对象不是定义`FeatureTable`中特征的序列，而是特征ID及其按85%相似度匹配序列的集合。作为输入提供的参考序列被用作定义有参OTU中的特征序列。

### 半有参/开放参考聚类

**Open-reference clustering**

像上面的有参聚类示例一样，可以使用`qiime vsearch cluster-features-open-reference`命令执行半有参(开放参考)聚类。

> 注：半有参OTU聚类通常以更高的百分比一致率执行，但这里使用85%，因此本教程的用户不必下载更大的参考数据库。通常，在某个百分比一致率对有相同百分比一致率聚类的参考数据库执行聚类，但这并没有正确地进行基准测试，以确定它是否是执行半有参(开放参考)聚类的最佳方法。

```
qiime vsearch cluster-features-open-reference \
  --i-table table.qza \
  --i-sequences rep-seqs.qza \
  --i-reference-sequences 85_otus.qza \
  --p-perc-identity 0.85 \
  --o-clustered-table table-or-85.qza \
  --o-clustered-sequences rep-seqs-or-85.qza \
  --o-new-reference-sequences new-ref-seqs-or-85.qza
```

**输出对象:**

- `new-ref-seqs-or-85.qza`: 新参考序列。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.11%2Fdata%2Ftutorials%2Fotu-clustering%2Fnew-ref-seqs-or-85.qza) | [下载](https://docs.qiime2.org/2020.11/data/tutorials/otu-clustering/new-ref-seqs-or-85.qza)
- `rep-seqs-or-85.qza`: 代表序列。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.11%2Fdata%2Ftutorials%2Fotu-clustering%2Frep-seqs-or-85.qza) | [下载](https://docs.qiime2.org/2020.11/data/tutorials/otu-clustering/rep-seqs-or-85.qza)
- `table-or-85.qza`: 特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2020.11%2Fdata%2Ftutorials%2Fotu-clustering%2Ftable-or-85.qza) | [下载](https://docs.qiime2.org/2020.11/data/tutorials/otu-clustering/table-or-85.qza)

`cluster-features-open-reference`输出结果是一个`FeatureTable[Frequency]`对象和两个`FeatureData[Sequence]`对象。其中一`FeatureData[Sequence]`对象表示聚集的序列，而另一个对象表示新的参考序列，由用于输入的参考序列以及作为内部重新聚集步骤的一部分聚集的序列组成。

## 译者简介

**刘永鑫**，博士，高级工程师，中科院青促会会员，QIIME 2项目参与人。2008年毕业于东北农业大学微生物学专业，2014年于中国科学院大学获生物信息学博士，2016年遗传学博士后出站留所工作，任工程师，研究方向为宏基因组数据分析。目前在***Science、Nature Biotechnology、Protein & Cell、Current Opinion in Microbiology***等杂志发表论文30余篇，被引3千余次。2017年7月创办“宏基因组”公众号，分享宏基因组、扩增子研究相关文章2400余篇，代表作有[《扩增子图表解读、分析流程和统计绘图三部曲(21篇)》](https://mp.weixin.qq.com/s/u7PQn2ilsgmA6Ayu-oP1tw)、 [《微生物组实验手册》](https://mp.weixin.qq.com/s/PzFglpqW1RwoqTLghpAIbA)、[《微生物组数据分析》](https://mp.weixin.qq.com/s/xHe1FHLm3n0Vkxz0nNbXvQ)等，关注人数11万+，累计阅读2100万+。

## Reference

https://docs.qiime2.org/2020.11

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