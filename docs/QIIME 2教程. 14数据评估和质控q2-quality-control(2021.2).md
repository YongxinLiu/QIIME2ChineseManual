[TOC]

# 数据评估和质控`q2-quality-control`

**Evaluating and controlling data quality with q2-quality-control**

https://docs.qiime2.org/2021.2/tutorials/quality-control/

> 注：本教程将演示如何为特定数据集训练`q2-feature-classifier`。我们将使用`Greengenes`参考数据库序列来训练`Naive Bayes`分类器，并从[《4人体各部位微生物组分析》](https://mp.weixin.qq.com/s/Stlb1ri6W7aSOF2rX2ru1A)中获得的代表性序列进行分类。

本教程将演示如何使用`q2-quality-control`根据模拟群体（mock communities，具有已知组成的样品）和序列数据过滤来评估数据质量。

## 下载数据

首先创建一个工作目录，再下载并创建几个文件：注意下载不稳定，可能需要多试几次

```
# 创建工作目录
mkdir -p quality-control
cd quality-control

# 下载测试数据
wget -c https://data.qiime2.org/2021.2/tutorials/quality-control/query-seqs.qza
wget -c https://data.qiime2.org/2021.2/tutorials/quality-control/reference-seqs.qza
wget -c https://data.qiime2.org/2021.2/tutorials/quality-control/query-table.qza
wget -c https://data.qiime2.org/2021.2/tutorials/quality-control/qc-mock-3-expected.qza
wget -c https://data.qiime2.org/2021.2/tutorials/quality-control/qc-mock-3-observed.qza
```

## 基于对齐过滤序列

**Excluding sequences by alignment**

`exclude-seqs`方法将`FeatureData[Sequence]`文件中包含的一组查询序列与一组参考序列对齐。此方法使用许多不同的对齐条件（BLAST evalue、相似度和覆盖度）来确定该序列是否“可比对”参考序列，并分别输出可比对/无法比对参考序列的两个文件。此方法有多种应用，包括**去除已知的污染物序列，排除宿主序列（例如人类DNA），或从数据中去除非目标序列（例如非细菌）**。

首先，我们将把一小部分查询序列分成可比对/无法比对参考序列的两类

```
qiime quality-control exclude-seqs \
  --i-query-sequences query-seqs.qza \
  --i-reference-sequences reference-seqs.qza \
  --p-method blast \
  --p-perc-identity 0.97 \
  --p-perc-query-aligned 0.97 \
  --o-sequence-hits hits.qza \
  --o-sequence-misses misses.qza
```

**输出对象:**

- `qc-mock-3-expected.qza`: 预期特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fquality-control%2Fqc-mock-3-expected.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/quality-control/qc-mock-3-expected.qza)
- `hits.qza`: 比对结果。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fquality-control%2Fhits.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/quality-control/hits.qza)
- `query-seqs.qza`: 输入序列。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fquality-control%2Fquery-seqs.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/quality-control/query-seqs.qza)
- `query-table.qza`: 输入特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fquality-control%2Fquery-table.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/quality-control/query-table.qza)
- `misses.qza`: 无法比对序列。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fquality-control%2Fmisses.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/quality-control/misses.qza)
- `reference-seqs.qza`: 参考数据库。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fquality-control%2Freference-seqs.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/quality-control/reference-seqs.qza)
- `qc-mock-3-observed.qza`: 观测特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fquality-control%2Fqc-mock-3-observed.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/quality-control/qc-mock-3-observed.qza)

此方法目前支持将`blast`、`vsearch`和`blastn-short`三种序列比对方法。请注意，如果查询序列包含非常短的序列（<30 nt），则应使用`blastn-short`方法。

既然您已经将序列拆分为一组`可比对/不可比对`参考序列的序列，那么您很可能希望在进一步分析之前筛选功能表以删除可比对或不可比对的序列。[过滤教程](https://docs.qiime2.org/2021.2/tutorials/filtering/)中介绍了从特征表中过滤特征，但这里我们将演示使用序列数据过滤特征表。在某些情况下，您可能希望从特征表中删除无法比对序列(no hit)，例如，**如您试图选择与细菌序列（或更具体的类）对齐的序列**。在其他情况下，您可能希望从特性表中删除比对序列，例如，你试图**过滤与宿主DNA相似的污染物或序列**。在这里，我们将筛选去除可比对，以演示如何从特征表中筛选序列；您可以在下面的命令中用`misses.qza`替换`hits.qza`，以筛选排除比对结果。

```
qiime feature-table filter-features \
  --i-table query-table.qza \
  --m-metadata-file hits.qza \
  --o-filtered-table no-hits-filtered-table.qza \
  --p-exclude-ids
```

**输出对象:**

- `no-hits-filtered-table.qza`: 排除指定ID的特征表。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fquality-control%2Fno-hits-filtered-table.qza) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/quality-control/no-hits-filtered-table.qza)

享受数据筛选的乐趣吧！

## 质量评估已知组成的样品

**Evaluating quality of samples with known composition**

[模拟群落(人工合成群落)](https://doi.org/10.1128/mSystems.00062-16)由已知的微生物菌株组成，这些菌株按规定的比例混合，这样就知道了样品的组成。人工重组群落对于评测生物信息学方法很有用，例如，确定某种方法或流程对预期成分的估计程度。许多研究在实验中包括模拟群落或其他样本，这些样本具有已知序列组成，以确定批次质量和基于每次运行的方法优化。`q2-quality-control`插件包含两个功能，可用于评估这个案例中模拟群落的准确性。`evaluate_composition`评估预期分类组成（或其他特征组成）重建的准确性。`evaluate_seqs` 评估观察到的序列与预期序列的相似性，例如，确定选择去噪或OTU方法的准确性，将在下一节中描述。

`evaluate_composition`比较两个单独的特征表中包含相同样本ID的观察和预期样本对的特征组成。通常，特征注释将由物种注释或其他分号分隔的功能注释组成。让我们旋转一下。

```
qiime quality-control evaluate-composition \
  --i-expected-features qc-mock-3-expected.qza \
  --i-observed-features qc-mock-3-observed.qza \
  --o-visualization qc-mock-3-comparison.qzv
```

**输出对象:**

- `qc-mock-3-comparison.qzv`: 特征表比较图。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fquality-control%2Fqc-mock-3-comparison.qzv) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/quality-control/qc-mock-3-comparison.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.13.01.jpg)

在每一个分号分隔的分类学级别上，分别计算预期和观测特征丰度之间的**分类准确率(Taxon accuracy rate, TAR)**、**分类检出率(taxon detection rate, TDR)**，和**线性回归得分(linear regression scores, r-squared)**，并**绘制每一级准确度和观察相关性图**。还生成假阳性观测(false positive observations)与最近预期特征(nearest common lineage in the expected feature)之间距离的柱状图，其中距离等于观测特征与最近预期特征的共有谱系之间的等级差异数。最后，在可视化的底部给出了假阳性`false positive`（错误分类和未分类）和假阴性`false negative`特征的列表。错误分类是指在最深层分类（如物种级）中不符合任何预期物种注释的特征，通常代表样品存在污染物或次优的生物信息学分析流程（如存在嵌合体序列或使用过度自信的物种分类器）。未分类(Underclassifications)是观察到的与预期特征相匹配的特征，但未被分类到预期的分类深度（例如，它们仅被分类到属级，但属级分类是正确的）；这些通常是有效特征（即，不是污染物），但由于技术限制，未被分类到所需的级别。技术限制包括序列太短、序列质量下降或方法不理想（只有一个不好的木匠会责怪他的工具，但一个工具可以做得比另一个更好）。假阴性是期望观察到的特征，但没有看到；可以将其与假阳性进行比较，以了解哪些特征可能被错过/分类不足。

## 评估序列质量

**Evaluating sequence quality**

`evaluate_seqs`将一组查询（例如，观察到的）序列与一组参考（例如，预期的）序列对齐，以评估比对质量。预期用途是将观察到的序列与预期序列（例如，来自模拟群落）比对，以确定观察到的序列与最相似的预期序列之间不匹配的频率，例如，作为测序/方法错误的定量评价。但是，可以提供任何序列作为输入，以根据一组参考序列生成比对质量报告。

```
qiime quality-control evaluate-seqs \
  --i-query-sequences query-seqs.qza \
  --i-reference-sequences reference-seqs.qza \
  --o-visualization eval-seqs-test.qzv
```

**输出对象:**

- `eval-seqs-test.qzv`: 序列比较图。 [查看](https://view.qiime2.org/?src=https%3A%2F%2Fdocs.qiime2.org%2F2021.2%2Fdata%2Ftutorials%2Fquality-control%2Feval-seqs-test.qzv) | [下载](https://docs.qiime2.org/2021.2/data/tutorials/quality-control/eval-seqs-test.qzv)

![image](http://bailab.genetics.ac.cn/markdown/qiime2/fig/2019.7.13.02.jpg)

该可视化显示了每个查询序列的比对结果、预期和观察到的序列之间的错配数量，以及每个查询序列与其在参考序列之间最接近的匹配（如果设置了`--p-show-alignments`）之间的最终成对比对情况。这个结果仍然相当初步，但计划在不久的将来进行扩展。请**持续关注吧！**

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