;Copyright (c) 2012 Christoph Mueller
;
;Permission is hereby granted, free of charge, to any person obtaining a 
;copy of this software and associated documentation files (the 
;"Software"), to deal in the Software without restriction, including 
;without limitation the rights to use, copy, modify, merge, publish, 
;distribute, sublicense, and/or sell copies of the Software, and to 
;permit persons to whom the Software is furnished to do so, subject to 
;the following conditions: 
;
;The above copyright notice and this permission notice shall be included 
;in all copies or substantial portions of the Software. 
;
;THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS 
;OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF 
;MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
;IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY 
;CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, 
;TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
;SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 

(ns cgpfun)

;;helper

;(set! *warn-on-reflection* true)

(defn rand-int-min 
  "rand-int with a minimum"
  [min max]
  (+ (rand-int (- max min)) min))

(defn abs [#^Float x] (Math/abs x))

;;nodes

(defprotocol Compute
  (compute
    [this nodes]
    "computes the node and all its dependencies")
  (compute-string
    [this nodes]
    "returns the string representing the mathematical operations"))

(defrecord AddNode [pos1 pos2]
  
  Compute
  (compute
    [this nodes]
    (let [n1 (nth nodes pos1)
          n2 (nth nodes pos2)]
      (+ (compute n1 nodes) (compute n2 nodes))))
  (compute-string
    [this nodes]
    (let [n1 (nth nodes pos1)
          n2 (nth nodes pos2)] 
      (str "(" (compute-string n1 nodes) " + " (compute-string n2 nodes) ")"))))

(defrecord MulNode [pos1 pos2]
  
  Compute
  (compute
    [this nodes]
    (let [n1 (nth nodes pos1)
          n2 (nth nodes pos2)]
      (* (compute n1 nodes) (compute n2 nodes))))
  (compute-string
    [this nodes]
    (let [n1 (nth nodes pos1)
          n2 (nth nodes pos2)] 
      (str "(" (compute-string n1 nodes) " * " (compute-string n2 nodes) ")"))))

(defrecord DivNode [pos1 pos2]
  
  Compute
  (compute
    [this nodes]
    (let [n1 (nth nodes pos1)
          n2 (nth nodes pos2)
          v2raw (compute n2 nodes)
          v2 (if (zero? v2raw) Float/POSITIVE_INFINITY v2raw)]
      (/ (compute n1 nodes) v2)))
  (compute-string
    [this nodes]
    (let [n1 (nth nodes pos1)
          n2 (nth nodes pos2)] 
      (str "(" (compute-string n1 nodes) " / " (compute-string n2 nodes) ")"))))

(defrecord ConstNode [#^float value]
  
  Compute
  (compute
    [this nodes]
    value)
  (compute-string
    [this nodes]
    value))

(defrecord VarNode [name]
  
  Compute
  (compute
    [this nodes]
    nil)
  (compute-string
    [this nodes]
    name))

(defrecord NopNode [pos]
  
  Compute
  (compute
    [this nodes]
    (compute (nth nodes pos) nodes))
  (compute-string
    [this nodes]
    (compute-string (nth nodes pos) nodes)))

(defn random-node
  "returns a randomly generated node at the given pos"
  [pos height offset]
  (let [choose (rand-int 5)
        max-pos (- pos (rem (- pos offset) height))]
    (cond
    (= choose 0) (AddNode.
                   (rand-int max-pos)
                   (rand-int max-pos))
    (= choose 1) (MulNode.
                   (rand-int max-pos)
                   (rand-int max-pos))
    (= choose 2) (DivNode.
                   (rand-int max-pos)
                   (rand-int max-pos))
    (= choose 3) (NopNode.
                   (rand-int max-pos))
    (= choose 4) (ConstNode.
                   (float (inc (rand-int 10)))))))

;;field

(defprotocol FieldOps
  (mutate
    [this factor]
    "returns a mutated copy for a given mutation factor")
  (fitness
    [this xs ys]
    "returns the fitness for a given set of xy pairs")
  (print-result
    [this]
    "prints the resulting formula *debug*"))

(defrecord Field [width height inputs output nodes]
  
  FieldOps
  (mutate
    [this factor]
    (let [size (count nodes)
          offset (count inputs)
          n (int (* (- size offset) factor))]
      (loop [i 0 mnodes (transient nodes)]
        (if (< i n)
          (let [x (rand-int-min offset size)]
            (if (= x (dec size))
              (recur (inc i) (assoc! mnodes x (NopNode. (rand-int x))))
              (recur (inc i) (assoc! mnodes x (random-node x height offset)))))
          (Field. width height inputs output (persistent! mnodes))))))
  (fitness
    [this xs ys]
    (let [n (count ys)
          ins (count inputs)]
      (loop [i 0 fit 0.0]
          (if (< i n)
            (let [tempns (loop [j 0 ns (transient nodes)]
                           (if (< j ins)
                             (recur (inc j)
                                    (assoc! ns j (ConstNode. (nth xs (+ (* i ins) j)))))
                             ns))
                  val (compute output tempns)
                  diff (abs (- val (nth ys i)))]
              (recur (inc i) (+ fit diff)))
            fit))))
  (print-result
    [this]
    (compute-string output nodes)))

(defn create-field 
  "creates a new field and fills it with random nodes"
  [width height inputs]
  (let [n (* width height)
        output (NopNode. (rand-int (dec n)))
        nodes
        (loop [i 0 v (transient inputs)]
          (if (< i n)
            (let [offset (count inputs)]
              (recur (inc i) (conj! v (random-node (+ i offset) height offset))))
            (persistent! (conj! v output))))]
    (Field. width height inputs output nodes)))

(defn return-best [x y xs ys]
  "returns the fitter of the two individuals x and y"
  (if (<= (fitness x xs ys) (fitness y xs ys))
    x
    y))


(defn generations
  "returns the fittest individual after n generations"
  [field n mutations factor xs ys]
  (loop [i 0 indv field]
    (if (< i n)
      (recur (inc i) 
             (reduce #(return-best %1 %2 xs ys) indv 
                     (take mutations (repeatedly 
                                       #(mutate indv factor)))))
      indv)))

(defn islands
  "creates n islands with a specified number of generation following a migration"
  [n migrations gens mutations factor xs ys width height inputs]
  (let [start (take n (repeatedly #(create-field width height inputs)))]
    (loop [mig 0 current start]
      (if (< mig migrations) 
        (recur (inc mig)
               (repeat n (reduce #(return-best %1 %2 xs ys)
                                 (pmap  #(generations % gens mutations factor xs ys)
                                        current))))
        (first current)))))

;;test the implementation

(def field (create-field 4 4[(VarNode. "x")]))

;test sets
;(def xs [0.5 1.0 2.0 4.0 5.0 8.0])
;(def ys [2.0 1.0 0.5 0.25 0.2 0.125])
(def xs [1.0 1.0 2.0 4.0 5.0 8.0 10.0 2.0])
(def ys [1.0     8.0     40.0    20.0])

;(def best (time (generations field 100 100 0.2 xs ys)))
(def best (time (islands 2 10 100 100 0.2 xs ys 3 3 [(VarNode. "a") (VarNode. "m")])))

(println (print-result best))
(println (fitness best xs ys))